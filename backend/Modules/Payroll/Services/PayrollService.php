<?php

namespace Modules\Payroll\Services;

use Core\Database;
use Modules\Payroll\Repositories\PayrollPeriodRepository;
use Modules\Payroll\Repositories\PayrollRepository;
use Modules\Payroll\Repositories\PayslipRepository;
use Modules\Payroll\Repositories\SalaryStructureRepository;

class PayrollService
{
    public function __construct(private PayrollRepository $payrolls, private PayrollPeriodRepository $periods, private SalaryStructureRepository $structures, private PayslipRepository $payslips) {}
    public function list(?string $periodId=null,?string $employeeId=null): array { return ['success'=>true,'payrolls'=>$this->payrolls->all($periodId,$employeeId),'summary'=>$this->payrolls->summary($periodId,$employeeId)]; }
    public function dashboard(?string $periodId=null): array
    {
        $period=$periodId ? $this->periods->find($periodId) : null;
        if ($periodId && !$period) return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];
        return ['success'=>true,'period'=>$period,'summary'=>$this->payrolls->summary($periodId),'status_counts'=>$periodId ? $this->payrolls->statusCounts($periodId) : []];
    }
    public function report(?string $periodId=null,?string $employeeId=null): array
    {
        if ($periodId && !$this->periods->find($periodId)) return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];
        return ['success'=>true,'records'=>$this->payrolls->report($periodId,$employeeId),'summary'=>$this->payrolls->summary($periodId,$employeeId)];
    }
    public function show(string $id): array { $payroll=$this->payrolls->find($id);if(!$payroll)return $this->notFound();return ['success'=>true,'payroll'=>$payroll,'incentives'=>$this->payrolls->adjustments($id,'incentive'),'deductions'=>$this->payrolls->adjustments($id,'deduction'),'payslip'=>$this->payslips->findByPayroll($id)]; }
    public function generate(array $data): array
    {
        $periodId=(string)($data['payroll_period_id']??'');$employeeId=(string)($data['employee_id']??'');$period=$this->periods->find($periodId);if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];if($period['status']!=='Draft')return ['success'=>false,'message'=>'Payroll can only be generated while its period is in draft.','status'=>409];$employeeStatus=$this->employeePayrollStatus($employeeId);if($employeeStatus===null)return ['success'=>false,'message'=>'Employee not found.','status'=>404];if(strtolower($employeeStatus)!=='active')return ['success'=>false,'message'=>'Payroll cannot be generated for an inactive employee.','status'=>409];if($this->payrolls->findForPeriodEmployee($periodId,$employeeId))return ['success'=>false,'message'=>'Payroll was already generated for this employee and period.','status'=>409];$structure=$this->structures->activeForEmployee($employeeId,$period['period_end']);if(!$structure)return ['success'=>false,'message'=>'The employee has no active salary structure for this payroll period.','status'=>422];$error=$this->validateDays($data);if($error)return $error;if((float)($data['total_incentives']??0)!==0.0||(float)($data['total_deductions']??0)!==0.0)return ['success'=>false,'message'=>'Use the incentive and deduction endpoints to add payroll adjustments.','status'=>422];
        $monthly=$this->monthlyGross($employeeId,(string)$period['period_end']);if($monthly===null)return ['success'=>false,'message'=>'The employee must have a compensation record before payroll can be generated.','status'=>422];$attendance=(float)$data['attendance_days'];$payable=(float)$data['payable_days'];$gross=round($monthly*($attendance>0?$payable/$attendance:0),2);
        try{return ['success'=>true,'message'=>'Payroll generated.','payroll'=>$this->payrolls->create(['payroll_period_id'=>$periodId,'employee_id'=>$employeeId,'salary_structure_id'=>$structure['salary_structure_id'],'attendance_days'=>$attendance,'payable_days'=>$payable,'lop_days'=>(float)($data['lop_days']??0),'overtime_hours'=>(float)($data['overtime_hours']??0),'gross_salary'=>$gross,'total_incentives'=>0,'total_deductions'=>0,'net_salary'=>$gross])];}catch(\PDOException $e){if(str_contains(strtolower($e->getMessage()),'duplicate'))return ['success'=>false,'message'=>'Payroll was already generated for this employee and period.','status'=>409];throw $e;}
    }
    public function transition(string $id,string $action,string $userId): array
    {
        $payroll=$this->payrolls->find($id);if(!$payroll)return $this->notFound();
        $period=$this->periods->find($payroll['payroll_period_id']);if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];
        $rules=['process'=>['payroll_status',['Draft']],'verify'=>['verification_status',['Pending']],'reject'=>['verification_status',['Pending']],'approve'=>['payroll_status',['Processing']],'pay'=>['payroll_status',['Approved']]];
        [$column,$allowed]=$rules[$action];
        $invalid=!in_array($payroll[$column],$allowed,true)
            ||($action==='process'&&$period['status']!=='Processing')
            ||(in_array($action,['verify','reject'],true)&&($payroll['payroll_status']!=='Processing'||$period['status']!=='Verification'))
            ||($action==='approve'&&($payroll['verification_status']!=='Verified'||$period['status']!=='Verification'))
            ||($action==='pay'&&$period['status']!=='Verification');
        if($invalid)return ['success'=>false,'message'=>'This payroll cannot transition to that status.','status'=>409];
        if($action==='pay' && $this->hasActivePayrollHold($payroll['employee_id']))return ['success'=>false,'message'=>'Salary payment is blocked because this employee has an active payroll hold. Release the hold before dispatching payment.','status'=>409];
        $status=['process'=>'Processing','verify'=>'Verified','reject'=>'Rejected','approve'=>'Approved','pay'=>'Paid'][$action];
        $db=Database::connection();$ownsTransaction=!$db->inTransaction();if($ownsTransaction)$db->beginTransaction();
        try {
            if ($action==='reject') {
                // A rejection sends the line back to the preparer, rather than
                // leaving a Processing payroll with no valid next transition.
                $this->payrolls->setStatus($id,$status,$userId);
                $updated=$this->payrolls->setStatus($id,'Draft',$userId);
                if ($period['status']==='Verification') $this->periods->setStatus($period['payroll_period_id'],'Processing',$userId);
            } else {
                $updated=$this->payrolls->setStatus($id,$status,$userId);
                if ($action==='pay') {$this->ensurePayslip($updated);$this->completePeriodIfPaid($updated['payroll_period_id'],$userId);}
            }
            if($ownsTransaction)$db->commit();
            return ['success'=>true,'message'=>$action==='pay'?'Payroll paid.':'Payroll '.strtolower($status).'.','payroll'=>$updated];
        } catch(\Throwable $e){if($ownsTransaction&&$db->inTransaction())$db->rollBack();throw $e;}
    }
    public function addAdjustment(string $payrollId,string $type,array $data): array { $payroll=$this->payrolls->find($payrollId);if(!$payroll)return $this->notFound();if($payroll['payroll_status']!=='Draft')return ['success'=>false,'message'=>'Adjustments can only be changed while payroll is in draft.','status'=>409];if(trim((string)($data['name']??''))===''||!isset($data['amount'])||!is_numeric($data['amount'])||(float)$data['amount']<0)return ['success'=>false,'message'=>'A name and non-negative amount are required.','status'=>422];$db=Database::connection();$db->beginTransaction();try{$adjustment=$this->payrolls->addAdjustment($payrollId,$payroll['employee_id'],$type,['name'=>trim((string)$data['name']),'amount'=>(float)$data['amount'],'reason'=>$data['reason']??null]);$this->recalculate($payrollId);$db->commit();return ['success'=>true,'message'=>ucfirst($type).' added.',$type=>$adjustment,'payroll'=>$this->payrolls->find($payrollId)];}catch(\Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;} }
    public function updateAdjustment(string $payrollId,string $id,string $type,array $data): array { $payroll=$this->payrolls->find($payrollId);if(!$payroll)return $this->notFound();$adjustment=$this->payrolls->findAdjustment($id,$type);if(!$adjustment||$adjustment['payroll_id']!==$payrollId)return ['success'=>false,'message'=>ucfirst($type).' not found.','status'=>404];if($payroll['payroll_status']!=='Draft')return ['success'=>false,'message'=>'Adjustments can only be changed while payroll is in draft.','status'=>409];if(trim((string)($data['name']??''))===''||!isset($data['amount'])||!is_numeric($data['amount'])||(float)$data['amount']<0)return ['success'=>false,'message'=>'A name and non-negative amount are required.','status'=>422];$db=Database::connection();$db->beginTransaction();try{$adjustment=$this->payrolls->updateAdjustment($id,$type,['name'=>trim((string)$data['name']),'amount'=>(float)$data['amount'],'reason'=>$data['reason']??null]);$this->recalculate($payrollId);$db->commit();return ['success'=>true,'message'=>ucfirst($type).' updated.',$type=>$adjustment,'payroll'=>$this->payrolls->find($payrollId)];}catch(\Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;} }
    public function deleteAdjustment(string $payrollId,string $id,string $type): array { $payroll=$this->payrolls->find($payrollId);if(!$payroll)return $this->notFound();$adjustment=$this->payrolls->findAdjustment($id,$type);if(!$adjustment||$adjustment['payroll_id']!==$payrollId)return ['success'=>false,'message'=>ucfirst($type).' not found.','status'=>404];if($payroll['payroll_status']!=='Draft')return ['success'=>false,'message'=>'Adjustments can only be changed while payroll is in draft.','status'=>409];$db=Database::connection();$db->beginTransaction();try{$this->payrolls->deleteAdjustment($id,$type);$this->recalculate($payrollId);$db->commit();return ['success'=>true,'message'=>ucfirst($type).' removed.','payroll'=>$this->payrolls->find($payrollId)];}catch(\Throwable $e){if($db->inTransaction())$db->rollBack();throw $e;} }
    public function myPayslips(string $employeeId): array{return ['success'=>true,'payslips'=>$this->payslips->forEmployee($employeeId)];}
    public function payslip(string $id, ?string $employeeId, bool $canManage): array { $payslip=$this->payslips->find($id);if(!$payslip)return ['success'=>false,'message'=>'Payslip not found.','status'=>404];if(!$canManage&&$payslip['employee_id']!==$employeeId)return ['success'=>false,'message'=>'You do not have permission to download this payslip.','status'=>403];return ['success'=>true,'payslip'=>$payslip]; }
    private function recalculate(string $id):void{$p=$this->payrolls->find($id);$in=$this->sum($id,'incentives');$de=$this->sum($id,'deductions');$net=round((float)$p['gross_salary']+$in-$de,2);if($net<0)throw new \DomainException('Total deductions cannot exceed gross salary plus incentives.');Database::connection()->prepare('UPDATE payrolls SET total_incentives=?,total_deductions=?,net_salary=? WHERE payroll_id=?')->execute([$in,$de,$net,$id]);}
    private function sum(string $id,string $table):float{$s=Database::connection()->prepare("SELECT COALESCE(SUM(amount),0) FROM $table WHERE payroll_id=?");$s->execute([$id]);return(float)$s->fetchColumn();}
    private function ensurePayslip(array $p):void{if($this->payslips->findByPayroll($p['payroll_id']))return;$number=sprintf('PS-%04d%02d-%s',(int)$p['payroll_year'],(int)$p['payroll_month'],strtoupper(substr(str_replace('-','',$p['payroll_id']),0,8)));$this->payslips->create($p['payroll_id'],$p['employee_id'],$number);}
    private function completePeriodIfPaid(string $periodId,string $userId):void{if($this->payrolls->countUnapprovedForPeriod($periodId)===0){$all=$this->payrolls->all($periodId);if($all&&count(array_filter($all,static fn(array $p):bool=>$p['payroll_status']!=='Paid'))===0)$this->periods->setStatus($periodId,'Completed',$userId);}}
    private function employeePayrollStatus(string $id):?string{try{$s=Database::connection()->prepare('SELECT es.status_name FROM employees e LEFT JOIN employee_statuses es ON es.employee_status_id=e.employee_status_id WHERE e.employee_id=? LIMIT 1');$s->execute([$id]);$status=$s->fetchColumn();if($status!==false)return(string)$status;}catch(\PDOException){}try{$s=Database::connection()->prepare('SELECT 1 FROM employees WHERE employee_id=?');$s->execute([$id]);return $s->fetchColumn()!==false?'Active':null;}catch(\PDOException){return null;}}
    private function monthlyGross(string $employeeId,string $periodEnd):?float{try{$db=Database::connection();try{$revision=$db->prepare("SELECT requested_salary FROM salary_revisions WHERE employee_id=? AND status='Approved' AND effective_from<=? ORDER BY effective_from DESC, reviewed_at DESC LIMIT 1");$revision->execute([$employeeId,$periodEnd]);$revised=$revision->fetchColumn();if($revised!==false)return(float)$revised;}catch(\PDOException){}$s=$db->prepare('SELECT gross_salary FROM employee_compensations WHERE employee_id=?');$s->execute([$employeeId]);$value=$s->fetchColumn();return $value!==false?(float)$value:null;}catch(\PDOException){return null;}}
    private function hasActivePayrollHold(string $employeeId):bool{try{$statement=Database::connection()->prepare("SELECT 1 FROM payroll_holds WHERE employee_id=? AND status='Active' LIMIT 1");$statement->execute([$employeeId]);return(bool)$statement->fetchColumn();}catch(\PDOException){return false;}}
    private function validateDays(array $d):?array{foreach(['attendance_days','payable_days']as$f)if(!isset($d[$f])||!is_numeric($d[$f])||(float)$d[$f]<0)return ['success'=>false,'message'=>"$f must be a non-negative number.",'status'=>422];if((float)$d['payable_days']>(float)$d['attendance_days'])return ['success'=>false,'message'=>'payable_days cannot exceed attendance_days.','status'=>422];foreach(['lop_days','overtime_hours','total_incentives','total_deductions','gross_salary']as$f)if(isset($d[$f])&&(!is_numeric($d[$f])||(float)$d[$f]<0))return ['success'=>false,'message'=>"$f must be a non-negative number.",'status'=>422];if(isset($d['lop_days'])&&(float)$d['lop_days']>(float)$d['attendance_days'])return ['success'=>false,'message'=>'lop_days cannot exceed attendance_days.','status'=>422];return null;}
    private function notFound():array{return ['success'=>false,'message'=>'Payroll not found.','status'=>404];}
}

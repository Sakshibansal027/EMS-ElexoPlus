<?php

namespace Modules\Payroll\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Authentication\Models\User;
use Modules\Authentication\Support\Request;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Payroll\Repositories\PayrollPeriodRepository;
use Modules\Payroll\Repositories\PayrollRepository;
use Modules\Payroll\Repositories\PayslipRepository;
use Modules\Payroll\Repositories\SalaryStructureRepository;
use Modules\Payroll\Services\PayrollService;

class PayrollController
{
    private PayrollService $service;
    public function __construct(){$this->service=new PayrollService(new PayrollRepository(),new PayrollPeriodRepository(),new SalaryStructureRepository(),new PayslipRepository());}
    public function index(array $params):array
    {
        $auth=AuthMiddleware::handle();if(isset($auth['error']))return $this->error($auth);$period=Request::input('period_id');$employee=null;
        if(!in_array(strtoupper((string)$auth['user']['role']),['ADMIN','HR'],true)){$employee=$auth['user']['employee_id']??null;if(!$employee)return ['success'=>false,'message'=>'Your employee profile is not linked to this account.','status'=>422];}
        return $this->service->list($period?:null,$employee);
    }
    public function dashboard(array $params):array { if($e=$this->manage())return $e;return $this->service->dashboard(Request::input('period_id') ?: null); }
    public function report(array $params):array { if($e=$this->manage())return $e;return $this->service->report(Request::input('period_id') ?: null,Request::input('employee_id') ?: null); }
    public function show(array $params):array{$auth=AuthMiddleware::handle();if(isset($auth['error']))return $this->error($auth);$result=$this->service->show($params['id']);if(!$result['success'])return $result;if(!$this->canAccess($auth['user'],$result['payroll']))return ['success'=>false,'message'=>'You do not have permission to view this payroll.','status'=>403];return $result;}
    public function generate(array $params):array{if($e=$this->manage())return $e;return $this->service->generate(Request::all());}
    public function process(array $params):array{return $this->transition($params['id'],'process',['ADMIN','HR']);}
    public function verify(array $params):array{return $this->transition($params['id'],'verify',['ADMIN','HR']);}
    public function reject(array $params):array{return $this->transition($params['id'],'reject',['ADMIN','HR']);}
    public function approve(array $params):array{return $this->transition($params['id'],'approve',['ADMIN']);}
    public function pay(array $params):array{return $this->transition($params['id'],'pay',['ADMIN']);}
    public function addIncentive(array $params):array{if($e=$this->manage())return $e;return $this->service->addAdjustment($params['id'],'incentive',Request::all());}
    public function addDeduction(array $params):array{if($e=$this->manage())return $e;return $this->service->addAdjustment($params['id'],'deduction',Request::all());}
    public function updateIncentive(array $params):array{if($e=$this->manage())return $e;return $this->service->updateAdjustment($params['id'],$params['adjustmentId'],'incentive',Request::all());}
    public function updateDeduction(array $params):array{if($e=$this->manage())return $e;return $this->service->updateAdjustment($params['id'],$params['adjustmentId'],'deduction',Request::all());}
    public function deleteIncentive(array $params):array{if($e=$this->manage())return $e;return $this->service->deleteAdjustment($params['id'],$params['adjustmentId'],'incentive');}
    public function deleteDeduction(array $params):array{if($e=$this->manage())return $e;return $this->service->deleteAdjustment($params['id'],$params['adjustmentId'],'deduction');}
    public function myPayslips(array $params):array{$auth=AuthMiddleware::handle();if(isset($auth['error']))return $this->error($auth);$employee=$auth['user']['employee_id']??null;if(!$employee)return ['success'=>false,'message'=>'Your employee profile is not linked to this account.','status'=>422];return $this->service->myPayslips($employee);}
    public function downloadPayslip(array $params): string|array { $auth=AuthMiddleware::handle();if(isset($auth['error']))return $this->error($auth);$manager=in_array(strtoupper((string)($auth['user']['role']??'')),['ADMIN','HR'],true);$result=$this->service->payslip($params['id'],$auth['user']['employee_id']??null,$manager);if(!$result['success'])return $result;$p=$result['payslip'];$content=$this->pdf("Payslip: {$p['payslip_number']}\nEmployee: {$p['full_name']} ({$p['employee_code']})\nPeriod: {$p['payroll_month']}/{$p['payroll_year']}\nGross Salary: {$p['gross_salary']}\nNet Salary: {$p['net_salary']}");header('Content-Type: application/pdf');header('Content-Disposition: inline; filename="'.str_replace('"','',$p['payslip_number']).'.pdf"');header('Content-Length: '.strlen($content));return $content; }
    private function transition(string $id,string $action,array $roles):array{$a=RoleMiddleware::handle($roles);if(isset($a['error']))return $this->error($a);return $this->service->transition($id,$action,User::idOf($a['user']));}
    private function manage():?array{$a=RoleMiddleware::handle(['ADMIN','HR']);return isset($a['error'])?$this->error($a):null;}
    private function canAccess(array $user,array $payroll):bool{return in_array(strtoupper((string)($user['role']??'')),['ADMIN','HR'],true)||(($user['employee_id']??null)===$payroll['employee_id']);}
    private function error(array $a):array{return ['success'=>false,'message'=>$a['error'],'status'=>$a['status']];}
    private function pdf(string $text): string { $text=str_replace(['\\','(',')',"\r"],['\\\\','\\(','\\)',''], $text);$stream="BT /F1 12 Tf 50 760 Td 16 TL ";foreach(explode("\n",$text) as $index=>$line){if($index>0)$stream.='T* ';$stream.='('.$line.') Tj ';}$stream.='ET';$objects=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',"<< /Length ".strlen($stream)." >>\nstream\n".$stream."\nendstream",'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];$pdf="%PDF-1.4\n";$offsets=[0];foreach($objects as $i=>$object){$offsets[] = strlen($pdf);$pdf.=($i+1)." 0 obj\n$object\nendobj\n";}$xref=strlen($pdf);$pdf="{$pdf}xref\n0 ".(count($objects)+1)."\n0000000000 65535 f \n";for($i=1;$i<=count($objects);$i++)$pdf.=sprintf('%010d 00000 n ', $offsets[$i])."\n";$pdf.="trailer << /Size ".(count($objects)+1)." /Root 1 0 R >>\nstartxref\n{$xref}\n%%EOF";return $pdf; }
}

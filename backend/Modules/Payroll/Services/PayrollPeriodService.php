<?php

namespace Modules\Payroll\Services;

use Modules\Payroll\Repositories\PayrollPeriodRepository;
use Modules\Payroll\Repositories\PayrollRepository;

class PayrollPeriodService
{
    public function __construct(private PayrollPeriodRepository $periods, private PayrollRepository $payrolls) {}
    public function list(): array { return ['success'=>true,'periods'=>$this->periods->all()]; }
    public function show(string $id): array { $period=$this->periods->find($id);return $period?['success'=>true,'period'=>$period]:['success'=>false,'message'=>'Payroll period not found.','status'=>404]; }
    public function create(array $data): array { $month=(int)($data['payroll_month']??0);$year=(int)($data['payroll_year']??0);if($month<1||$month>12||$year<2020||$year>2100)return ['success'=>false,'message'=>'A valid payroll_month and payroll_year are required.','status'=>422];if($this->periods->findByMonth($month,$year))return ['success'=>false,'message'=>'A payroll period already exists for this month.','status'=>409];$start=(string)($data['period_start']??sprintf('%04d-%02d-01',$year,$month));$end=(string)($data['period_end']??date('Y-m-t',strtotime($start)));if(!$this->date($start)||!$this->date($end)||$end<$start||$this->monthKey($start)!==sprintf('%04d-%02d',$year,$month)||$this->monthKey($end)!==sprintf('%04d-%02d',$year,$month))return ['success'=>false,'message'=>'Period dates must be valid, ordered, and within the selected payroll month.','status'=>422];return ['success'=>true,'message'=>'Payroll period created.','period'=>$this->periods->create(['payroll_month'=>$month,'payroll_year'=>$year,'period_start'=>$start,'period_end'=>$end])]; }
    public function update(string $id,array $data): array { $period=$this->periods->find($id);if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];if($period['status']!=='Draft')return ['success'=>false,'message'=>'Only a draft payroll period can be changed.','status'=>409];$data=array_intersect_key($data,array_flip(['period_start','period_end']));if(!$data)return ['success'=>false,'message'=>'period_start or period_end is required.','status'=>422];$merged=array_merge($period,$data);$month=sprintf('%04d-%02d',(int)$period['payroll_year'],(int)$period['payroll_month']);if(!$this->date((string)$merged['period_start'])||!$this->date((string)$merged['period_end'])||$merged['period_end']<$merged['period_start']||$this->monthKey((string)$merged['period_start'])!==$month||$this->monthKey((string)$merged['period_end'])!==$month)return ['success'=>false,'message'=>'Period dates must be valid, ordered, and within the selected payroll month.','status'=>422];return ['success'=>true,'message'=>'Payroll period updated.','period'=>$this->periods->update($id,$data)]; }
    public function delete(string $id): array { $period=$this->periods->find($id);if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];if($period['status']!=='Draft')return ['success'=>false,'message'=>'Only a draft payroll period can be deleted.','status'=>409];if($this->payrolls->all($id))return ['success'=>false,'message'=>'A payroll period with generated payrolls cannot be deleted.','status'=>409];$this->periods->delete($id);return ['success'=>true,'message'=>'Payroll period deleted.']; }
    public function start(string $id,string $userId): array { $period=$this->periods->find($id);if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];if($period['status']!=='Draft')return ['success'=>false,'message'=>'Only a draft payroll period can be started.','status'=>409];if(!$this->payrolls->all($id))return ['success'=>false,'message'=>'Generate at least one payroll before starting the period.','status'=>422];return ['success'=>true,'message'=>'Payroll period is processing.','period'=>$this->periods->setStatus($id,'Processing',$userId)]; }
    public function submit(string $id,string $userId): array
    {
        $period=$this->periods->find($id);
        if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];
        if($period['status']!=='Processing')return ['success'=>false,'message'=>'Only a processing payroll period can be submitted for verification.','status'=>409];
        $payrolls=$this->payrolls->all($id);
        if(!$payrolls)return ['success'=>false,'message'=>'Generate at least one payroll before submitting the period.','status'=>422];
        if(array_filter($payrolls,static fn(array $payroll):bool=>$payroll['payroll_status']!=='Processing'))return ['success'=>false,'message'=>'Every payroll must be processed before submitting the period.','status'=>409];
        return ['success'=>true,'message'=>'Payroll period submitted for verification.','period'=>$this->periods->setStatus($id,'Verification',$userId)];
    }
    public function lock(string $id,string $userId): array { $period=$this->periods->find($id);if(!$period)return ['success'=>false,'message'=>'Payroll period not found.','status'=>404];if($period['status']!=='Completed')return ['success'=>false,'message'=>'Only a completed payroll period can be locked.','status'=>409];return ['success'=>true,'message'=>'Payroll period locked.','period'=>$this->periods->setStatus($id,'Locked',$userId)]; }
    private function date(string $v): bool{$d=\DateTime::createFromFormat('Y-m-d',$v);return $d&&$d->format('Y-m-d')===$v;}
    private function monthKey(string $date): string { return substr($date,0,7); }
}

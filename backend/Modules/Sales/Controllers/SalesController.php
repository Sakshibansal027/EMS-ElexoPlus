<?php

namespace Modules\Sales\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Authentication\Models\User;
use Modules\Authentication\Support\Request;
use Modules\Sales\Repositories\SalesRepository;

final class SalesController
{
    public function __construct(private SalesRepository $sales = new SalesRepository()) {}
    private function auth(): array { return AuthMiddleware::handle(); }
    private function fail(array $auth): array { return ['success'=>false,'message'=>$auth['error'],'status'=>$auth['status']]; }
    public function leads(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $filters=Request::all(); if ($this->isExecutive($a['user'])) $filters['employee_id']=(string)($a['user']['employee_id']??''); return ['success'=>true,'data'=>$this->sales->leads($filters)]; }
    public function storeLead(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $d=Request::all(); foreach(['segment','lead_name','phone_number'] as $f) if(empty($d[$f])) return ['success'=>false,'message'=>'Missing required field: '.$f,'status'=>422]; $id=(string)($a['user']['employee_id'] ?? ''); if(!$id) return ['success'=>false,'message'=>'Authenticated user is not linked to an employee.','status'=>422]; return ['success'=>true,'data'=>$this->sales->createLead($d,$id),'status'=>201]; }
    public function updateLead(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $row=$this->sales->updateLead($params['id'],Request::all(),(string)($a['user']['employee_id']??'')); return $row?['success'=>true,'data'=>$row]:['success'=>false,'message'=>'Lead not found.','status'=>404]; }
    public function activities(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $d=Request::all(); if(empty($d['note'])) return ['success'=>false,'message'=>'Note is required.','status'=>422]; return ['success'=>true,'data'=>$this->sales->addActivity($params['id'],$d['type']??'Note',$d['note'],(string)($a['user']['employee_id']??'')),'status'=>201]; }
    public function dashboard(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); return ['success'=>true,'data'=>$this->sales->dashboard()]; }
    public function orders(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $employeeId=$this->isExecutive($a['user'])?(string)($a['user']['employee_id']??''):null; return ['success'=>true,'data'=>$this->sales->orders($employeeId)]; }
    public function territories(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); return ['success'=>true,'data'=>$this->sales->territories()]; }
    public function targets(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $id=$this->isExecutive($a['user'])?(string)($a['user']['employee_id']??''):null; return ['success'=>true,'data'=>$this->sales->targets($id)]; }
    public function storeTarget(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $d=Request::all(); if ((float)($d['target_value']??0) <= 0) return ['success'=>false,'message'=>'Target value must be greater than zero.','status'=>422]; return ['success'=>true,'data'=>$this->sales->createTarget($d,(string)($a['user']['employee_id']??'')),'status'=>201]; }
    public function visits(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $id=$this->isExecutive($a['user'])?(string)($a['user']['employee_id']??''):null; return ['success'=>true,'data'=>$this->sales->visits($id)]; }
    public function expenses(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $id=$this->isExecutive($a['user'])?(string)($a['user']['employee_id']??''):null; return ['success'=>true,'data'=>$this->sales->expenses($id)]; }
    public function reports(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $id=$this->isExecutive($a['user'])?(string)($a['user']['employee_id']??''):null; return ['success'=>true,'data'=>$this->sales->reports($id)]; }
    public function assignOrderTerritory(array $params): array { $a=$this->auth(); if(isset($a['error'])) return $this->fail($a); $d=Request::all(); $ok=$this->sales->assignOrderTerritory($params['id'],(string)($d['territory']??'')); return $ok?['success'=>true,'message'=>'Territory updated.']:['success'=>false,'message'=>'Order or territory not found.','status'=>404]; }
    private function isExecutive(array $user): bool { return in_array(strtoupper((string)($user['role']??'')), ['SE','SALES_EXECUTIVE','SALES EXECUTIVE'], true); }
}

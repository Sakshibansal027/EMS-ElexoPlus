<?php

namespace Modules\Payroll\Controllers;

use Modules\Authentication\Middleware\AuthMiddleware;
use Modules\Authentication\Support\Request;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Payroll\Repositories\SalaryStructureRepository;
use Modules\Payroll\Services\SalaryStructureService;

class SalaryStructureController
{
    private SalaryStructureService $service;
    public function __construct(){$this->service=new SalaryStructureService(new SalaryStructureRepository());}
    public function index(array $params):array{if($error=$this->manage())return $error;return $this->service->list(Request::input('all','0')==='1');}
    public function show(array $params):array{if($error=$this->manage())return $error;return $this->service->show($params['id']);}
    public function store(array $params):array{if($error=$this->manage())return $error;return $this->service->create(Request::all());}
    public function update(array $params):array{if($error=$this->manage())return $error;return $this->service->update($params['id'],Request::all());}
    public function delete(array $params):array{if($error=$this->manage())return $error;return $this->service->delete($params['id']);}
    public function assign(array $params):array{if($error=$this->manage())return $error;return $this->service->assign($params['id'],Request::all());}
    private function manage():?array{$a=RoleMiddleware::handle(['ADMIN','HR']);return isset($a['error'])?['success'=>false,'message'=>$a['error'],'status'=>$a['status']]:null;}
}

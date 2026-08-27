<?php

namespace Modules\Payroll\Controllers;

use Modules\Authentication\Models\User;
use Modules\Authentication\Support\Request;
use Modules\Leave\Middleware\RoleMiddleware;
use Modules\Payroll\Repositories\PayrollPeriodRepository;
use Modules\Payroll\Repositories\PayrollRepository;
use Modules\Payroll\Services\PayrollPeriodService;

class PayrollPeriodController
{
    private PayrollPeriodService $service;
    public function __construct(){$this->service=new PayrollPeriodService(new PayrollPeriodRepository(),new PayrollRepository());}
    public function index(array $params):array{if($e=$this->manage())return $e;return $this->service->list();}
    public function show(array $params):array{if($e=$this->manage())return $e;return $this->service->show($params['id']);}
    public function store(array $params):array{if($e=$this->manage())return $e;return $this->service->create(Request::all());}
    public function update(array $params):array{if($e=$this->manage())return $e;return $this->service->update($params['id'],Request::all());}
    public function delete(array $params):array{if($e=$this->manage())return $e;return $this->service->delete($params['id']);}
    public function start(array $params):array{$auth=$this->managerAuth();if(isset($auth['error']))return $this->error($auth);return $this->service->start($params['id'],User::idOf($auth['user']));}
    public function submit(array $params):array{$auth=$this->managerAuth();if(isset($auth['error']))return $this->error($auth);return $this->service->submit($params['id'],User::idOf($auth['user']));}
    public function lock(array $params):array{$auth=$this->managerAuth();if(isset($auth['error']))return $this->error($auth);return $this->service->lock($params['id'],User::idOf($auth['user']));}
    private function managerAuth():array{return RoleMiddleware::handle(['ADMIN','HR']);}
    private function manage():?array{$a=$this->managerAuth();return isset($a['error'])?$this->error($a):null;}
    private function error(array $a):array{return ['success'=>false,'message'=>$a['error'],'status'=>$a['status']];}
}

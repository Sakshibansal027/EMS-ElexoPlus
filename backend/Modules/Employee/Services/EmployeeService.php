<?php

namespace Modules\Employee\Services;

use Modules\Employee\Repositories\EmployeeRepository;

class EmployeeService
{
    public function __construct(private EmployeeRepository $employees) {}

    public function list(): array { return ['success' => true, 'employees' => array_map([$this, 'present'], $this->employees->all())]; }
    public function show(string $id): array { $employee=$this->employees->find($id); return $employee ? ['success'=>true,'employee'=>$this->present($employee)] : ['success'=>false,'message'=>'Employee not found.','status'=>404]; }
    public function options(): array { return ['success'=>true,'data'=>$this->employees->options()]; }
    public function create(array $data): array { $validated=$this->validate($data); if(isset($validated['error'])) return $validated; return ['success'=>true,'message'=>'Employee created.','employee'=>$this->present($this->employees->create($validated))]; }
    public function update(string $id, array $data): array { if(!$this->employees->find($id)) return ['success'=>false,'message'=>'Employee not found.','status'=>404]; $validated=$this->validate($data, true); if(isset($validated['error'])) return $validated; return ['success'=>true,'message'=>'Employee updated.','employee'=>$this->present($this->employees->update($id, $validated))]; }
    public function delete(string $id): array { if(!$this->employees->find($id)) return ['success'=>false,'message'=>'Employee not found.','status'=>404]; $this->employees->deactivate($id); return ['success'=>true,'message'=>'Employee deactivated.']; }

    private function validate(array $data, bool $partial=false): array
    {
        $map=['name'=>'full_name','department'=>'department_id','designation'=>'designation_id','joiningDate'=>'date_of_joining','employmentType'=>'employment_type_id','location'=>'work_location_id','status'=>'employee_status_id','manager'=>'reporting_manager_id'];
        foreach($map as $from=>$to) if(isset($data[$from])&&!isset($data[$to])) $data[$to]=$data[$from];
        $references = [
            'department_id' => ['departments', 'department_id', 'department_name'],
            'designation_id' => ['designations', 'designation_id', 'designation_name'],
            'employment_type_id' => ['employment_types', 'employment_type_id', 'employment_type_name'],
            'work_location_id' => ['work_locations', 'work_location_id', 'location_name'],
            'employee_status_id' => ['employee_statuses', 'employee_status_id', 'status_name'],
        ];
        foreach ($references as $field => [$table, $idColumn, $nameColumn]) {
            if (isset($data[$field])) {
                $resolved = $this->employees->resolveReference($table, $idColumn, $nameColumn, (string) $data[$field]);
                if (!$resolved) return ['error'=>true,'success'=>false,'message'=>"Invalid $field.",'status'=>422];
                $data[$field] = $resolved;
            }
        }
        if (isset($data['reporting_manager_id']) && $data['reporting_manager_id'] !== '') {
            $resolved = $this->employees->resolveReference('employees', 'employee_id', 'full_name', (string) $data['reporting_manager_id']);
            if (!$resolved) return ['error'=>true,'success'=>false,'message'=>'Invalid reporting manager.','status'=>422];
            $data['reporting_manager_id'] = $resolved;
        }
        foreach(['full_name','email','phone','gender','department_id','designation_id','date_of_joining','employment_type_id','work_location_id','employee_status_id'] as $field) if(!$partial && empty($data[$field])) return ['error'=>true,'success'=>false,'message'=>"$field is required.",'status'=>422];
        if(isset($data['email'])&&!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) return ['error'=>true,'success'=>false,'message'=>'A valid email is required.','status'=>422];
        if(!$partial) $data['employee_code']=$data['employee_code'] ?? ('EMP-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)));
        return $data;
    }

    private function present(array $employee): array
    {
        return [
            'id' => $employee['employee_code'],
            'code' => $employee['employee_code'],
            'name' => $employee['full_name'],
            'email' => $employee['email'],
            'phone' => $employee['phone'],
            'gender' => $employee['gender'],
            'dob' => $employee['date_of_birth'],
            'department' => $employee['department'],
            'designation' => $employee['designation'],
            'manager' => $employee['manager_name'] ?? 'Not assigned',
            'joiningDate' => $employee['date_of_joining'],
            'employmentType' => $employee['employment_type'],
            'location' => $employee['work_location'],
            'status' => $employee['employee_status'],
        ];
        return ['id'=>$employee['employee_id'],'employeeId'=>$employee['employee_id'],'code'=>$employee['employee_code'],'name'=>$employee['full_name'],'email'=>$employee['email'],'phone'=>$employee['phone'],'gender'=>$employee['gender'],'dob'=>$employee['date_of_birth'],'department'=>$employee['department'],'departmentId'=>$employee['department_id'],'designation'=>$employee['designation'],'designationId'=>$employee['designation_id'],'manager'=>$employee['manager_name'] ?? '—','managerId'=>$employee['reporting_manager_id'],'joiningDate'=>$employee['date_of_joining'],'employmentType'=>$employee['employment_type'],'employmentTypeId'=>$employee['employment_type_id'],'location'=>$employee['work_location'],'locationId'=>$employee['work_location_id'],'status'=>$employee['employee_status'],'statusId'=>$employee['employee_status_id']];
    }
}

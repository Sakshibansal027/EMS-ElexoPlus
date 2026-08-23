<?php

namespace Modules\Employee\Services;

use Modules\Employee\Repositories\EmployeeRepository;
use PDOException;

class EmployeeService
{
    public function __construct(private EmployeeRepository $employees) {}

    public function list(): array { return ['success' => true, 'employees' => array_map(fn(array $employee) => $this->present($employee), $this->employees->all())]; }
    public function show(string $id): array { $employee=$this->employees->find($id); return $employee ? ['success'=>true,'employee'=>$this->present($employee, true)] : ['success'=>false,'message'=>'Employee not found.','status'=>404]; }
    public function options(): array { return ['success'=>true,'data'=>$this->employees->options()]; }
    public function create(array $data): array {
        $validated=$this->validate($data); if(isset($validated['error'])) return $validated;
        try { $employee=$this->employees->create($validated); $this->employees->saveProfileData($employee['employee_id'], $data); return ['success'=>true,'message'=>'Employee created.','employee'=>$this->present($this->employees->find($employee['employee_id']))]; }
        catch (PDOException $exception) { return ['success'=>false,'message'=>$this->databaseMessage($exception), 'status'=>422]; }
    }
    public function update(string $id, array $data): array {
        $existing=$this->employees->find($id); if(!$existing) return ['success'=>false,'message'=>'Employee not found.','status'=>404];
        $validated=$this->validate($data, true); if(isset($validated['error'])) return $validated;
        try { $employee=$this->employees->update($existing['employee_id'], $validated); $this->employees->saveProfileData($existing['employee_id'], $data); return ['success'=>true,'message'=>'Employee updated.','employee'=>$this->present($employee)]; }
        catch (PDOException $exception) { return ['success'=>false,'message'=>$this->databaseMessage($exception), 'status'=>422]; }
    }
    public function delete(string $id): array { $existing=$this->employees->find($id); if(!$existing) return ['success'=>false,'message'=>'Employee not found.','status'=>404]; $this->employees->deactivate($existing['employee_id']); return ['success'=>true,'message'=>'Employee deactivated.']; }

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
        $groups = [
            ['bankName', 'accountNo', 'ifsc'],
            ['pan', 'aadhaar', 'uan'],
            ['basicSalary', 'hra', 'allowance', 'bonus', 'grossSalary', 'netSalary'],
        ];
        foreach ($groups as $fields) {
            $provided = array_filter($fields, static fn(string $field) => isset($data[$field]) && $data[$field] !== '');
            if ($provided && count($provided) !== count($fields)) return ['error'=>true,'success'=>false,'message'=>'Please complete every field in the related bank, statutory, or salary section.','status'=>422];
        }
        if (isset($data['pan']) && $data['pan'] !== '' && !preg_match('/^[A-Z]{5}[0-9]{4}[A-Z]$/i', (string) $data['pan'])) return ['error'=>true,'success'=>false,'message'=>'PAN must use the format ABCDE1234F.','status'=>422];
        if (isset($data['aadhaar']) && $data['aadhaar'] !== '' && !preg_match('/^\d{12}$/', preg_replace('/\D/', '', (string) $data['aadhaar']))) return ['error'=>true,'success'=>false,'message'=>'Aadhaar number must contain 12 digits.','status'=>422];
        if (isset($data['uan']) && $data['uan'] !== '' && !preg_match('/^\d{12}$/', preg_replace('/\D/', '', (string) $data['uan']))) return ['error'=>true,'success'=>false,'message'=>'UAN number must contain 12 digits.','status'=>422];
        foreach (['basicSalary','hra','allowance','bonus','grossSalary','netSalary'] as $field) if (isset($data[$field]) && $data[$field] !== '' && (!is_numeric($data[$field]) || (float) $data[$field] < 0)) return ['error'=>true,'success'=>false,'message'=>'Salary values must be positive numbers.','status'=>422];
        if(!$partial) $data['employee_code']=$data['employee_code'] ?? ('EMP-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)));
        return $data;
    }

    private function present(array $employee, bool $detailed = false): array
    {
        $result = [
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
        if (!$detailed) return $result;
        $view = $this->employees->viewData($employee['employee_id']);
        $balances = array_column($view['balances'], 'remaining_days', 'leave_policy_code');
        return [...$result,
            'address' => $view['address']['address_line_1'] ?? 'Not provided',
            'bankName' => $view['bank']['bank_name'] ?? '', 'accountNo' => $view['bank']['account_number'] ?? '', 'ifsc' => $view['bank']['ifsc_code'] ?? '',
            'pan' => $view['statutory']['pan_number'] ?? '', 'aadhaar' => $view['statutory']['aadhaar_number'] ?? '', 'uan' => $view['statutory']['uan_number'] ?? '',
            'basicSalary' => $view['compensation']['basic_salary'] ?? 0, 'hra' => $view['compensation']['hra'] ?? 0, 'allowance' => $view['compensation']['allowance'] ?? 0,
            'bonus' => $view['compensation']['bonus'] ?? 0, 'grossSalary' => $view['compensation']['gross_salary'] ?? 0, 'netSalary' => $view['compensation']['net_salary'] ?? 0,
            'casualLeave' => (float) ($balances['CL'] ?? 0), 'earnedLeave' => (float) ($balances['EL'] ?? 0), 'sickLeave' => (float) ($balances['SL'] ?? 0),
            'documents' => array_map(static fn(array $document) => [
                'id' => $document['document_id'],
                'name' => $document['document_name'],
                'type' => $document['document_type'],
                'status' => $document['status'] === 'Verified' ? 'Uploaded' : $document['status'],
            ], $this->employees->documentsForEmployee($employee['employee_id']))];
        return ['id'=>$employee['employee_id'],'employeeId'=>$employee['employee_id'],'code'=>$employee['employee_code'],'name'=>$employee['full_name'],'email'=>$employee['email'],'phone'=>$employee['phone'],'gender'=>$employee['gender'],'dob'=>$employee['date_of_birth'],'department'=>$employee['department'],'departmentId'=>$employee['department_id'],'designation'=>$employee['designation'],'designationId'=>$employee['designation_id'],'manager'=>$employee['manager_name'] ?? '—','managerId'=>$employee['reporting_manager_id'],'joiningDate'=>$employee['date_of_joining'],'employmentType'=>$employee['employment_type'],'employmentTypeId'=>$employee['employment_type_id'],'location'=>$employee['work_location'],'locationId'=>$employee['work_location_id'],'status'=>$employee['employee_status'],'statusId'=>$employee['employee_status_id']];
    }

    private function databaseMessage(PDOException $exception): string
    {
        return str_contains(strtolower($exception->getMessage()), 'duplicate') ? 'Email or employee code already exists.' : 'Unable to save employee data. Please review the supplied values.';
    }
}

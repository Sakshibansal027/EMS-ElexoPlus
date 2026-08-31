<?php

namespace Modules\Sales\Repositories;

use Core\Database;
use Modules\Sales\Support\Uuid;

final class SalesRepository
{
    private function db(): \PDO { return Database::connection(); }

    public function leads(array $filters = []): array
    {
        $where = [];
        $values = [];
        if (!empty($filters['status'])) { $where[] = 'l.current_status = ?'; $values[] = $this->dbStatus($filters['status']); }
        if (!empty($filters['segment']) && $filters['segment'] !== 'All') { $where[] = 'l.segment = ?'; $values[] = $filters['segment']; }
        if (!empty($filters['employee_id'])) { $where[] = '(l.assigned_employee_id = ? OR e.employee_code = ?)'; $values[] = $filters['employee_id']; $values[] = $filters['employee_id']; }
        $sql = 'SELECT l.*, e.full_name AS assigned_employee_name
                FROM leads l LEFT JOIN employees e ON e.employee_id=l.assigned_employee_id';
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY l.created_at DESC';
        $stmt = $this->db()->prepare($sql); $stmt->execute($values);
        return array_map([$this, 'leadView'], $stmt->fetchAll());
    }

    public function findLead(string $id): ?array
    {
        $stmt = $this->db()->prepare('SELECT l.*, e.full_name AS assigned_employee_name FROM leads l LEFT JOIN employees e ON e.employee_id=l.assigned_employee_id WHERE l.lead_id=? LIMIT 1');
        $stmt->execute([$id]); $row = $stmt->fetch();
        return $row ? $this->leadView($row) : null;
    }

    public function createLead(array $data, string $employeeId): array
    {
        $id = Uuid::generate();
        $assigned = $this->resolveEmployee($data['assigned_employee_id'] ?? null, $data['assigned_to'] ?? null) ?: $employeeId;
        $stmt = $this->db()->prepare('INSERT INTO leads (lead_id,segment,lead_name,company_name,contact_person,phone_number,email,requirement,estimated_value,gst_number,assigned_employee_id,lead_source,lead_priority,current_status,region,next_follow_up_date,remarks) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->execute([$id, $data['segment'], $data['lead_name'], $data['company_name'] ?: null, $data['contact_person'] ?: null, $data['phone_number'], $data['email'] ?: null, $data['requirement'] ?: null, (float)($data['estimated_value'] ?: 0), $data['gst_number'] ?: null, $assigned, $data['lead_source'] ?: 'Website', $data['lead_priority'] ?: 'Medium', 'New Lead', $data['region'] ?: null, $data['next_follow_up_date'] ?: null, $data['remarks'] ?: null]);
        $this->addActivity($id, 'System', 'Lead profile created.', $employeeId);
        return $this->findLead($id);
    }

    public function updateLead(string $id, array $data, string $changedBy): ?array
    {
        $lead = $this->findLead($id); if (!$lead) return null;
        if (array_key_exists('assigned_to', $data)) {
            $resolved = $this->resolveEmployee(null, $data['assigned_to']);
            if ($resolved) $data['assigned_employee_id'] = $resolved;
        }
        $allowed = ['segment','lead_name','company_name','contact_person','phone_number','email','requirement','estimated_value','gst_number','assigned_employee_id','lead_source','lead_priority','current_status','region','next_follow_up_date','remarks'];
        $sets = []; $values = [];
        foreach ($allowed as $field) if (array_key_exists($field, $data)) { $sets[] = "$field = ?"; $values[] = $field === 'current_status' ? $this->dbStatus($data[$field]) : ($data[$field] === '' ? null : $data[$field]); }
        if ($sets) { $values[] = $id; $this->db()->prepare('UPDATE leads SET '.implode(',', $sets).' WHERE lead_id=?')->execute($values); }
        if (isset($data['current_status']) && $this->dbStatus($data['current_status']) !== $lead['current_status']) {
            $this->db()->prepare('INSERT INTO lead_status_history (history_id,lead_id,old_status,new_status,changed_by,remarks) VALUES (?,?,?,?,?,?)')->execute([Uuid::generate(),$id,$lead['current_status'],$this->dbStatus($data['current_status']),$changedBy,'Status updated from sales UI']);
        }
        return $this->findLead($id);
    }

    public function activities(string $leadId): array
    {
        $stmt = $this->db()->prepare('SELECT activity_id id, activity_type type, note, e.full_name user, created_at FROM sales_activity_logs a LEFT JOIN employees e ON e.employee_id=a.created_by WHERE lead_id=? ORDER BY created_at DESC');
        $stmt->execute([$leadId]); return array_map(static function(array $row): array { $row['time'] = date('d M Y, h:i A', strtotime($row['created_at'])); unset($row['created_at']); return $row; }, $stmt->fetchAll());
    }

    public function addActivity(string $leadId, string $type, string $note, string $employeeId): array
    {
        $id = Uuid::generate(); $this->db()->prepare('INSERT INTO sales_activity_logs (activity_id,lead_id,activity_type,note,created_by) VALUES (?,?,?,?,?)')->execute([$id,$leadId,$type,$note,$employeeId]);
        return $this->activities($leadId)[0];
    }

    public function dashboard(): array
    {
        $db = $this->db();
        $summary = $db->query("SELECT COUNT(*) total_leads, COALESCE(SUM(estimated_value),0) pipeline_value, SUM(current_status='Closed') converted_leads FROM leads")->fetch() ?: [];
        $people = $db->query("SELECT SUM(role='ASM' AND status='Active') total_asm, SUM(role='SALES_EXECUTIVE' AND status='Active') total_se FROM users")->fetch() ?: [];
        $orders = $db->query("SELECT COUNT(*) total_orders, COALESCE(SUM(order_value),0) total_sales FROM orders WHERE order_status <> 'Cancelled'")->fetch() ?: [];
        $target = $db->query("SELECT COALESCE(SUM(target_value),0) target_value, COALESCE(SUM(achieved_value),0) achieved_value FROM targets WHERE status IN ('Active','Completed') AND period_start <= CURDATE() AND period_end >= CURDATE()")->fetch() ?: [];
        $trend = $db->query("SELECT DATE_FORMAT(order_date,'%Y-%m') period, COALESCE(SUM(order_value),0) sales FROM orders WHERE order_status <> 'Cancelled' GROUP BY DATE_FORMAT(order_date,'%Y-%m') ORDER BY period DESC LIMIT 12")->fetchAll();
        $regions = $db->query("SELECT COALESCE(t.territory_name,'Unassigned') name, COALESCE(SUM(o.order_value),0) value FROM orders o LEFT JOIN territories t ON t.territory_id=o.territory_id WHERE o.order_status <> 'Cancelled' GROUP BY COALESCE(t.territory_name,'Unassigned') ORDER BY value DESC")->fetchAll();
        $total = array_sum(array_map(static fn(array $row): float => (float)$row['value'], $regions));
        $regions = array_map(static function (array $row) use ($total): array { $row['value'] = $total > 0 ? round(((float)$row['value'] / $total) * 100, 1) : 0; return $row; }, $regions);
        $target['target_achievement'] = (float)($target['target_value'] ?? 0) > 0 ? round(((float)$target['achieved_value'] / (float)$target['target_value']) * 100, 1) : 0;
        return ['summary'=>array_merge($summary,$orders,$people,$target), 'trend'=>array_reverse($trend), 'regions'=>$regions];
    }

    public function orders(?string $employeeId = null): array
    {
        $sql = 'SELECT o.*, c.client_name, e.full_name AS employee_name, t.territory_name FROM orders o JOIN clients c ON c.client_id=o.client_id JOIN employees e ON e.employee_id=o.employee_id LEFT JOIN territories t ON t.territory_id=o.territory_id';
        $values = []; if ($employeeId) { $sql .= ' WHERE o.employee_id=?'; $values[] = $employeeId; } $sql .= ' ORDER BY o.order_date DESC, o.created_at DESC';
        $stmt = $this->db()->prepare($sql); $stmt->execute($values); return $stmt->fetchAll();
    }

    public function territories(): array { return $this->db()->query("SELECT territory_id id, territory_name name FROM territories WHERE status='Active' ORDER BY territory_name")->fetchAll(); }

    public function assignOrderTerritory(string $orderId, string $territory): bool
    {
        $stmt = $this->db()->prepare('SELECT territory_id FROM territories WHERE (territory_id=? OR territory_name=?) AND status=\'Active\' LIMIT 1');
        $stmt->execute([$territory, $territory]); $territoryId = $stmt->fetchColumn();
        if (!$territoryId) return false;
        return $this->db()->prepare('UPDATE orders SET territory_id=? WHERE order_id=?')->execute([$territoryId, $orderId]);
    }

    public function targets(?string $employeeId = null): array
    {
        $sql = 'SELECT t.*, tt.target_type_name, e.full_name employee_name, tr.territory_name FROM targets t JOIN target_types tt ON tt.target_type_id=t.target_type_id JOIN employees e ON e.employee_id=t.assigned_to_employee_id LEFT JOIN territories tr ON tr.territory_id=t.territory_id';
        $values = []; if ($employeeId) { $sql .= ' WHERE t.assigned_to_employee_id=?'; $values[] = $employeeId; } $sql .= ' ORDER BY t.period_start DESC';
        $stmt = $this->db()->prepare($sql); $stmt->execute($values); return $stmt->fetchAll();
    }

    public function createTarget(array $data, string $assignedBy): array
    {
        $assigned = $this->resolveEmployee($data['assigned_to_employee_id'] ?? null, $data['assigned_to'] ?? null);
        if (!$assigned) throw new \InvalidArgumentException('Target employee was not found.');
        $type = $data['target_type_id'] ?? $this->db()->query("SELECT target_type_id FROM target_types WHERE status='Active' ORDER BY target_type_name LIMIT 1")->fetchColumn();
        if (!$type) throw new \InvalidArgumentException('No active target type is configured.');
        $start = $data['period_start'] ?? date('Y-m-01'); $end = $data['period_end'] ?? date('Y-m-t');
        $id = Uuid::generate();
        $this->db()->prepare('INSERT INTO targets (target_id,target_type_id,assigned_to_employee_id,target_period,period_start,period_end,target_value,assigned_by_employee_id,remarks) VALUES (?,?,?,?,?,?,?,?,?)')->execute([$id,$type,$assigned,$data['target_period'] ?? 'Monthly',$start,$end,(float)($data['target_value'] ?? 0),$assignedBy,$data['remarks'] ?? null]);
        return $this->targets($assigned)[0] ?? [];
    }

    public function visits(?string $employeeId = null): array
    {
        $sql = 'SELECT v.*, c.client_name customer, c.address, c.city FROM client_visits v JOIN clients c ON c.client_id=v.client_id';
        $values = []; if ($employeeId) { $sql .= ' WHERE v.employee_id=?'; $values[] = $employeeId; } $sql .= ' ORDER BY v.visit_date DESC';
        $stmt = $this->db()->prepare($sql); $stmt->execute($values); return $stmt->fetchAll();
    }

    public function expenses(?string $employeeId = null): array
    {
        $sql = 'SELECT * FROM expenses'; $values = []; if ($employeeId) { $sql .= ' WHERE employee_id=?'; $values[] = $employeeId; } $sql .= ' ORDER BY expense_date DESC, created_at DESC';
        $stmt = $this->db()->prepare($sql); $stmt->execute($values); return $stmt->fetchAll();
    }

    public function reports(?string $employeeId = null): array
    {
        $sql = 'SELECT r.*, e.full_name employee_name FROM daily_activity_reports r JOIN employees e ON e.employee_id=r.employee_id';
        $values = []; if ($employeeId) { $sql .= ' WHERE r.employee_id=?'; $values[] = $employeeId; } $sql .= ' ORDER BY report_date DESC';
        $stmt = $this->db()->prepare($sql); $stmt->execute($values); return $stmt->fetchAll();
    }

    private function resolveEmployee(?string $employeeId, ?string $employeeName): ?string
    {
        if ($employeeId) {
            $stmt = $this->db()->prepare('SELECT employee_id FROM employees WHERE employee_id = ? OR employee_code = ? LIMIT 1');
            $stmt->execute([$employeeId, $employeeId]);
            return $stmt->fetchColumn() ?: null;
        }
        if (!$employeeName || $employeeName === 'Unassigned') return null;
        $stmt = $this->db()->prepare('SELECT employee_id FROM employees WHERE full_name = ? OR employee_code = ? LIMIT 1');
        $stmt->execute([$employeeName, $employeeName]);
        return $stmt->fetchColumn() ?: null;
    }

    private function dbStatus(string $status): string { return ['New'=>'New Lead','Converted'=>'Closed'][$status] ?? $status; }
    private function leadView(array $row): array
    {
        $status = ['New Lead'=>'New','Closed'=>'Converted'][$row['current_status']] ?? $row['current_status'];
        $row['id'] = $row['lead_id']; $row['type'] = $row['segment']; $row['name'] = $row['lead_name']; $row['company'] = $row['company_name'] ?: '—'; $row['phone'] = $row['phone_number']; $row['value'] = (float)$row['estimated_value']; $row['assignedTo'] = $row['assigned_employee_name'] ?: 'Unassigned'; $row['status'] = $status; $row['activities'] = $this->activities($row['lead_id']);
        return $row;
    }
}

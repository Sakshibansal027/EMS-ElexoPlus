import { useState } from "react";
import EmployeeCard from "./EmployeeCard";
import EmployeeDetailsModal from "./EmployeeDetailsModal/EmployeeDetailsModal";
import { getEmployeeById } from "../services/employeeService";



const EmployeeGrid = ({ employees, onEdit, onDelete }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const loadEmployee = async (employee, action) => {
    try {
      const detailedEmployee = await getEmployeeById(employee.id);
      action(detailedEmployee);
    } catch {
      window.alert("Unable to load employee details.");
    }
  };
  return (
    <>
      <div className="grid gap-6 mt-8 md:grid-cols-2 xl:grid-cols-3">

        {employees.length > 0 ? (
          employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onView={() => void loadEmployee(employee, setSelectedEmployee)}
              onEdit={(selected) => void loadEmployee(selected, onEdit)}
              onDelete={onDelete}
            />

          )
          )) : (
          <p className="text-center text-gray-400 py-10">
            No employees found.
          </p>
        )
        }
      </div>
      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
          onEdit={() => { onEdit(selectedEmployee); setSelectedEmployee(null); }}
          onDelete={async () => { await onDelete(selectedEmployee.id); setSelectedEmployee(null); }}
        />
      )}
    </>

  );
};

export default EmployeeGrid;

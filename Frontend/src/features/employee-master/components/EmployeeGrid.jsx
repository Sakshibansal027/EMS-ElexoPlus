import { useState } from "react";
import EmployeeCard from "./EmployeeCard";
import EmployeeDetailsModal from "./EmployeeDetailsModal/EmployeeDetailsModal";
const EmployeeGrid = ({ employees,onEdit }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  return (
    <>
      <div className="grid gap-6 mt-8 md:grid-cols-2 xl:grid-cols-3">

        {employees.length > 0 ?(
          employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onView={() => setSelectedEmployee(employee)}
              onEdit={onEdit}
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
        />
      )}
    </>

  );
};

export default EmployeeGrid;
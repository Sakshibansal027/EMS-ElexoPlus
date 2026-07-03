import { useState } from "react";
import employees from "../data/employee";
import EmployeeCard from "./EmployeeCard";
import EmployeeDetailsModal from "./EmployeeDetailsModal/EmployeeDetailsModal";
const EmployeeGrid = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);
  return (
    <>
      <div className="grid gap-6 mt-8 md:grid-cols-2 xl:grid-cols-3">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
         onView={() => setSelectedEmployee(employee)}
        />
        
      ))}
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
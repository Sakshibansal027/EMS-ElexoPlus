
import useAuth from "../../auth/hooks/useAuth";
import ROLES from "../../../config/roles";

import AdminAttendance from "./AdminAttendance";
import ManagerAttendance from "./ManagerAttendance";
import EmployeeAttendance from "./EmployeeAttendance";

const AttendanceRouter = () => {
  const { user } = useAuth();
  const role = user?.role;

  if (role === ROLES.ADMIN) {
    return (
      <AdminAttendance
        title="Attendance Management"
        description={
          <>
            Full{" "}
            <span className="font-semibold text-primary">
              organization-wide
            </span>{" "}
            view of attendance, approvals, analytics and reports.
          </>
        }
      />
    );
  }

  if (role === ROLES.HR) {
    return (
      <AdminAttendance
        title="HR — Attendance"
        description={
          <>
            Manage{" "}
            <span className="font-semibold text-primary">attendance</span>,
            approve correction requests and generate reports.
          </>
        }
      />
    );
  }

  if (role === ROLES.ASM) {
    return <ManagerAttendance />;
  }

  // SALES_EXECUTIVE and any other role fall back to the employee view
  return <EmployeeAttendance />;
};

export default AttendanceRouter;

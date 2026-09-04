import useAuth from "../../auth/hooks/useAuth";
import ROLES from "../../../config/roles";
import AdminAttendance from "./AdminAttendance";
import ManagerAttendance from "./ManagerAttendance";
import EmployeeAttendance from "./EmployeeAttendance";
import HrAttendance from "./HrAttendance";

const AttendanceRouter = () => {
  const { user } = useAuth();
  if (user?.role === ROLES.ADMIN) return <AdminAttendance />;
  if (user?.role === ROLES.HR) return <HrAttendance />;
  if (user?.role === ROLES.ASM) return <ManagerAttendance />;
  return <EmployeeAttendance />;
};

export default AttendanceRouter;

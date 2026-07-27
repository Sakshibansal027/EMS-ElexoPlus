import { useOutletContext } from "react-router-dom";
import AdminReports from "./AdminReports";
import EmployeeReports from "./EmployeeReports";
import ROLES from "../../../config/roles";

const ReportsPage = () => {
  const { role } = useOutletContext();

  switch (role) {
    case ROLES.ADMIN:
    case ROLES.HR:
      return <AdminReports />;

    case ROLES.ASM:
    case ROLES.SALES_EXECUTIVE:
      return <EmployeeReports />;

    default:
      return <AdminReports />;
  }
};

export default ReportsPage;

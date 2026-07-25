import { useOutletContext } from "react-router-dom";

import AdminSalesDashboard from "../pages/AdminSalesDashboard.jsx";
import HrSalesDashboard from "../pages/HrSalesDashboard.jsx";
import AsmSalesDashboard from "../pages/AsmSalesDashboard.jsx";
import SeSalesDashboard from "../pages/SeSalesDashboard.jsx";

import ROLES from "../../../config/roles";

const SalesPage = () => {
  const { role } = useOutletContext();

  switch (role) {
    case ROLES.ADMIN:
      return <AdminSalesDashboard />;

    case ROLES.HR:
      return <HrSalesDashboard />;

    case ROLES.ASM:
      return <AsmSalesDashboard />;

    case ROLES.SALES_EXECUTIVE:
      return <SeSalesDashboard />;

    default:
      return null;
  }
};

export default SalesPage;
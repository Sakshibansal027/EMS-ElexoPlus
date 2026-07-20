import AdminSalesDashboard from "./AdminSalesDashboard.jsx";
import HrSalesDashboard from "./HrSalesDashboard.jsx";
import AsmSalesDashboard from "./AsmSalesDashboard.jsx";
import SeSalesDashboard from "./SeSalesDashboard.jsx";
const SalesPage = () => {
  const role = "HR"; // later auth se aayega

  return (
    <>
      {role === "ADMIN" && <AdminSalesDashboard />}
      {role === "HR" && <HrSalesDashboard />}
      {role === "ASM" && <AsmSalesDashboard />}
      {role === "SE" && <SeSalesDashboard />}

    </>
  );
};

export default SalesPage;
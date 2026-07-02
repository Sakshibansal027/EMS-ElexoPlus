import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ComingSoon from "../components/common/ComingSoon";

import { ROUTES } from "./routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to={ROUTES.DASHBOARD} replace />}
        />

        <Route element={<DashboardLayout />}>

          <Route
            path={ROUTES.DASHBOARD}
            element={<Dashboard />}
          />

          <Route
            path={ROUTES.EMPLOYEE}
            element={<ComingSoon title="Employee Master" />}
          />

          <Route
            path={ROUTES.ATTENDANCE}
            element={<ComingSoon title="Attendance" />}
          />

          <Route
            path={ROUTES.LEAVE}
            element={<ComingSoon title="Leave Management" />}
          />

          <Route
            path={ROUTES.PAYROLL}
            element={<ComingSoon title="Payroll" />}
          />

          <Route
            path={ROUTES.SALES}
            element={<ComingSoon title="Sales" />}
          />

          <Route
            path={ROUTES.REPORTS}
            element={<ComingSoon title="Reports" />}
          />

          <Route
            path={ROUTES.SETTINGS}
            element={<ComingSoon title="Settings" />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
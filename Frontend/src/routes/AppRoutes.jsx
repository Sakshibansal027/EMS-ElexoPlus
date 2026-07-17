import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AttendancePage from "../features/attendance/pages/AttendancePage";
import DashboardLayout from "../layouts/DashboardLayout";
import Profile from "../features/profile/pages/Profile";
import LoginPage from "../features/auth/pages/LoginPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import SettingsPage from "../features/settings/pages/SettingsPage";
import Dashboard from "../features/dashboard/pages/Dashboard";
import ComingSoon from "../components/common/ComingSoon";
import EmployeeMaster from "../features/employee-master/pages/EmployeeMaster";
import Sales from "../features/sales/pages/SalesPage";
import EmployeeLeaveDashboard from "../features/leave/pages/employeeLeaveDashboard";
import EmployeePayrollDashboard from "../features/payroll/pages/employeePayrollDashboard";
import { ROUTES } from "./routes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ============================
                Default Route
        ============================ */}
        <Route path="/" element={<Navigate to={ROUTES.LOGIN} replace />} />

        {/* ============================
                Public Routes
        ============================ */}

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />

        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* ============================
              Protected Routes
        ============================ */}

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />

          <Route path={ROUTES.PROFILE} element={<Profile />} />

          <Route path={ROUTES.EMPLOYEE} element={<EmployeeMaster />} />
          <Route
            path="/attendance"
            element={<AttendancePage />}
          />

          <Route
            path={ROUTES.LEAVE}
            element={<EmployeeLeaveDashboard />}
          />

          <Route
            path={ROUTES.PAYROLL}
            element={<EmployeePayrollDashboard />}
          />

          <Route
            path={ROUTES.SALES}
            element={<Sales />}
          />

          <Route
            path={ROUTES.REPORTS}
            element={<ComingSoon title="Reports" />}
          />

          <Route
            path={ROUTES.SETTINGS}
            element={<SettingsPage />}
          />
        </Route>

        {/* ============================
                Fallback Route
        ============================ */}

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

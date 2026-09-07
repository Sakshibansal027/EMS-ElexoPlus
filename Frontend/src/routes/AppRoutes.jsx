import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import authStorage from "../features/auth/utils/authStorage";
import DashboardLayout from "../layouts/DashboardLayout";
import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import LoadingPage from "../components/common/LoadingPage";
import NotFoundPage from "../components/common/NotFoundPage";
import RouteLoader from "../components/common/RouteLoader";
import { ROUTES } from "./routes";

const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage"));
const Profile = lazy(() => import("../features/profile/pages/Profile"));
const SettingsPage = lazy(() => import("../features/settings/pages/SettingsPage"));
const Dashboard = lazy(() => import("../features/dashboard/pages/Dashboard"));
const ReportsPage = lazy(() => import("../features/reports/pages/ReportsPage"));
const EmployeeMaster = lazy(() => import("../features/employee-master/pages/EmployeeMaster"));
const LeaveManagement = lazy(() => import("../features/leave/pages/LeaveManagement"));
const Sales = lazy(() => import("../features/sales/pages/SalesPage"));
const PayrollManagement = lazy(() => import("../features/payroll/pages/PayrollManagement"));
const AttendanceRouter = lazy(() => import("../features/attendance/pages/AttendanceRouter"));
const NotificationsPage = lazy(() => import("../features/notifications/pages/NotificationsPage"));
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <RouteLoader />
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route
            path="/"
            element={
              authStorage.isAuthenticated() ? (
                <Navigate to={ROUTES.DASHBOARD} replace />
              ) : (
                <Navigate to={ROUTES.LOGIN} replace />
              )
            }
          />

          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

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
              path={ROUTES.ATTENDANCE}
              element={<AttendanceRouter />}
            />

            <Route
              path={ROUTES.LEAVE}
              element={<LeaveManagement />}
            />

            <Route
              path={ROUTES.PAYROLL}
              element={<PayrollManagement />}
            />

            <Route
              path={ROUTES.SALES}
              element={<Sales />}
            />

            <Route
              path={ROUTES.REPORTS}
              element={<ReportsPage />}
            />

            <Route
              path={ROUTES.SETTINGS}
              element={<SettingsPage />}
            />

            <Route
              path={ROUTES.NOTIFICATIONS}
              element={<NotificationsPage />}
            />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRoutes;

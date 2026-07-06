import { Navigate, Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import useAuth from "../features/auth/hooks/useAuth";

import { ROUTES } from "../routes/routes";

const DashboardLayout = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const DASHBOARD_STATE = {
    role: user.role,
    user,
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}

      <Sidebar {...DASHBOARD_STATE} />

      {/* Main Layout */}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar {...DASHBOARD_STATE} />

        <main className="flex-1 overflow-y-auto">
          <div className="dashboard-bg">
            <div className="mx-auto w-full max-w-[1800px] p-8">
              <Outlet context={DASHBOARD_STATE} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
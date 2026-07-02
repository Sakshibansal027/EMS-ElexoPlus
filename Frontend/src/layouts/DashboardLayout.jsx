import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import ROLES from "../config/roles";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-[var(--background)]">

      <Sidebar role={ROLES.ADMIN} />

      <main className="flex flex-1 flex-col overflow-hidden">

        <Navbar />

        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

      </main>

    </div>
  );
};

export default DashboardLayout;
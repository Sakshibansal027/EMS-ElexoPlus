import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";

import ROLES from "../config/roles";

// =========================================
// Temporary Development Role
// =========================================

const CURRENT_ROLE = ROLES.ADMIN // Change this to test different roles:


// =========================================
// Temporary Mock User
// =========================================

const CURRENT_USER = {
  [ROLES.ADMIN]: {
    name: "Harshit Goel",
    email: "admin@elexoplus.com",
    designation: "Administrator",
    status: "System Live",
  },

  [ROLES.HR]: {
    name: "Sakshi Bansal",
    email: "sakshi@elexoplus.com",
    designation: "HR Manager",
    status: "System Live",
  },

  [ROLES.ASM]: {
    name: "Gaurav Kumar",
    email: "gaurav@elexoplus.com",
    designation: "Area Sales Manager",
    status: "System Live",
  },

  [ROLES.SALES_EXECUTIVE]: {
    name: "Nisha Barnwal",
    email: "nisha@elexoplus.com",
    designation: "Sales Executive",
    status: "System Live",
  },
}[CURRENT_ROLE];

// =========================================
// Dashboard State
// =========================================

const DASHBOARD_STATE = {
  role: CURRENT_ROLE,
  user: CURRENT_USER,
};

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* =========================================
                    Sidebar
      ========================================= */}

      <Sidebar {...DASHBOARD_STATE} />

      {/* =========================================
                    Main Layout
      ========================================= */}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* =====================================
                    Navbar
        ===================================== */}

        <Navbar {...DASHBOARD_STATE} />

        {/* =====================================
                  Page Content
        ===================================== */}

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

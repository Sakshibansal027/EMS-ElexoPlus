// import { useState } from "react";
// import { SETTINGS_TABS } from "../config/settingsTabs";
// import useAuth from "../../auth/hooks/useAuth";
import CompanySettings from "./CompanySettings";
import DepartmentSettings from "./DepartmentSettings";
import DesignationSettings from "./DesignationSettings";
import EmploymentTypeSettings from "./EmploymentTypeSettings";
import EmployeeStatusSettings from "./EmployeeStatusSettings";
import AppPreferences from "./AppPreferences";
import useSettings from "../hooks/useSettings";

const COMPONENT_MAP = {
    company: CompanySettings,
    departments: DepartmentSettings,
    designations: DesignationSettings,
    "employment-types": EmploymentTypeSettings,
    "employee-statuses": EmployeeStatusSettings,
    preferences: AppPreferences,
};

const SettingsPage = () => {
    // const { user } = useAuth();
    // const userRole = user?.role;

    // const allowedTabs = SETTINGS_TABS.filter(
    //     (tab) => tab.roles.includes(userRole),
    // );

    // const firstTab = allowedTabs.length > 0 ? allowedTabs[0].id : null;
    // const [activeTab, setActiveTab] = useState(firstTab);

    // const adminTabs = allowedTabs.filter((t) => t.section === "admin");
    // const preferenceTabs = allowedTabs.filter((t) => t.section === "preferences");

    const {
        activeTab,
        setActiveTab,
        adminTabs,
        preferenceTabs,
    } = useSettings();

    const ActiveComponent = COMPONENT_MAP[activeTab];
    const tabs = [
        ...adminTabs,
        ...preferenceTabs,
    ];



    return (
        <div className="page-enter">
            <div className="mb-8">
                <p className="mt-2 text-lg text-foreground-muted">
                    Configure and manage your <span className="text-[var(--color-primary)] font-medium"> organization </span>{" "} settings.
                </p>
            </div>


            <div className="space-y-5">

                {/* Top Navigation */}

                {/* Top Navigation - Updated UI */}
                <div className="dashboard-card sticky top-4 z-10 p-2 backdrop-blur-md overflow-x-auto scrollbar-hide">
                    <div className="flex items-center gap-1"> {/* gap kam kiya taki compact rahe */}
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                        flex items-center gap-2 shrink-0 rounded-lg px-4 py-2.5
                        text-sm font-medium transition-all duration-200 cursor-pointer
                        ${isActive
                                            ? "bg-primary text-black shadow-sm"
                                            : "text-foreground-muted hover:bg-secondary/50 hover:text-primary"
                                        }
                    `}
                                >
                                    <Icon size={16} />
                                    <span className="whitespace-nowrap">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="h-2"/>

                {/* Content */}

                <div
                    key={activeTab}
                    className="page-enter animate-in fade-in duration-300" >
                    <ActiveComponent />
                </div>

            </div>


        </div>
    );
};

export default SettingsPage;

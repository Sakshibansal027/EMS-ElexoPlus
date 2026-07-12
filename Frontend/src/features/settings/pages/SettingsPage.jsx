import { useState } from "react";
import { SETTINGS_TABS } from "../config/settingsTabs";
import useAuth from "../../auth/hooks/useAuth";
import CompanySettings from "./CompanySettings";
import DepartmentSettings from "./DepartmentSettings";
import DesignationSettings from "./DesignationSettings";
import EmploymentTypeSettings from "./EmploymentTypeSettings";
import EmployeeStatusSettings from "./EmployeeStatusSettings";
import AppPreferences from "./AppPreferences";

const COMPONENT_MAP = {
    company: CompanySettings,
    departments: DepartmentSettings,
    designations: DesignationSettings,
    "employment-types": EmploymentTypeSettings,
    "employee-statuses": EmployeeStatusSettings,
    preferences: AppPreferences,
};

const SettingsPage = () => {
    const { user } = useAuth();
    const userRole = user?.role;

    const allowedTabs = SETTINGS_TABS.filter(
        (tab) => tab.roles.includes(userRole),
    );

    const firstTab = allowedTabs.length > 0 ? allowedTabs[0].id : null;
    const [activeTab, setActiveTab] = useState(firstTab);

    const adminTabs = allowedTabs.filter((t) => t.section === "admin");
    const preferenceTabs = allowedTabs.filter((t) => t.section === "preferences");

    const ActiveComponent = COMPONENT_MAP[activeTab];

    return (
        <div className="page-enter">
            <div className="mb-8">
                <p className="mt-2 text-lg text-foreground-muted">
                    Configure and manage your <span className="text-[var(--color-primary)] font-medium"> organization </span>{" "} settings.
                </p>
            </div>

            <div className="flex gap-8">
                <nav className="w-72 shrink-0 space-y-1" aria-label="Settings navigation">
                    {adminTabs.length > 0 && (
                        <>
                            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Administration
                            </p>
                            {adminTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-start gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 cursor-pointer ${isActive
                                                ? "bg-primary text-primary-foreground shadow-[var(--shadow-primary)]"
                                                : "text-foreground-muted hover:bg-card hover:text-primary"
                                            }`}
                                    >
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-black/10" : "bg-muted"
                                            }`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold truncate">{tab.label}</p>
                                            <p className={`text-xs mt-0.5 truncate ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                                                }`}>
                                                {tab.description}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}

                    {adminTabs.length > 0 && preferenceTabs.length > 0 && (
                        <div className="my-4 border-t border-border" />
                    )}

                    {preferenceTabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-start gap-4 rounded-2xl px-4 py-4 text-left transition-all duration-300 cursor-pointer ${isActive
                                        ? "bg-primary text-primary-foreground shadow-[var(--shadow-primary)]"
                                        : "text-foreground-muted hover:bg-card hover:text-primary"
                                    }`}
                            >
                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isActive ? "bg-black/10" : "bg-muted"
                                    }`}>
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{tab.label}</p>
                                    <p className={`text-xs mt-0.5 truncate ${isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                                        }`}>
                                        {tab.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </nav>

                <div className="flex-1 min-w-0">
                    <ActiveComponent />
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

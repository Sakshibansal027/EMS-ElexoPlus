import { useMemo, useState } from "react";

import useAuth from "../../auth/hooks/useAuth";

import { getSettingsTabs } from "../services/settingsService";
import SETTINGS_PERMISSIONS from "../config/settingsPermissions";

const permissionKeyMap = {
    company: "company",
    departments: "departments",
    designations: "designations",
    "employment-types": "employmentTypes",
    "employee-statuses": "employeeStatuses",
    preferences: "preferences",
};

const useSettings = () => {

    const { user } = useAuth();

    const role = user?.role;

    const permissions =
        SETTINGS_PERMISSIONS[role] || {};

    const tabs = useMemo(() => {

        return getSettingsTabs().filter((tab) => {

            const key = permissionKeyMap[tab.id];

            return permissions[key];

        });

    }, [permissions]);

    const [activeTab, setActiveTab] = useState(
        tabs[0]?.id || null,
    );

    const adminTabs =
        tabs.filter((tab) => tab.section === "admin");

    const preferenceTabs =
        tabs.filter(
            (tab) => tab.section === "preferences",
        );

    return {

        activeTab,

        setActiveTab,

        adminTabs,

        preferenceTabs,

        permissions,

    };

};

export default useSettings;
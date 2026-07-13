import { useMemo } from "react";

// fake user (baad me auth se replace kar dena)
const useUser = () => {
  return {
    role: "ASM", // change: ADMIN | HR | ASM | SE
  };
};

export const useSalesData = () => {
  const { role } = useUser();

  const config = useMemo(() => {
    switch (role) {
      case "ADMIN":
        return {
          cards: [
            "totalASM",
            "totalSE",
            "totalSales",
            "targetAchievement",
          ],
          permissions: {
            viewAll: true,
            canAssignTarget: true,
            canOverride: true,
          },
        };

      case "HR":
        return {
          cards: [
            "activeASM",
            "activeSE",
            "performanceSummary",
            "monthlyAchievement",
          ],
          permissions: {
            viewAll: true,
            canAssignTarget: true,
            readOnlyOps: true,
          },
        };

      case "ASM":
        return {
          cards: [
            "teamTarget",
            "teamAchievement",
            "lowPerformers",
            "activeSE",
          ],
          permissions: {
            viewTeamOnly: true,
            canAssignSE: true,
            canSetTarget: true,
          },
        };

      case "SE":
        return {
          cards: [
            "myTarget",
            "achievement",
            "orders",
            "incentive",
          ],
          permissions: {
            selfOnly: true,
            canCreateLead: true,
            canCreateOrder: true,
          },
        };

      default:
        return {
          cards: [],
          permissions: {},
        };
    }
  }, [role]);

  return {
    role,
    cards: config.cards,
    permissions: config.permissions,
  };
};
import StatsCard from "./StatsCard";

import {
  Users,
  UserCheck,
  UserX,
  Building2,
} from "lucide-react";





const EmployeeStats = ({stats}) => {
  const statCards = [
  {
    id: 1,
    title: "Total Employees",
    value: stats.totalEmployees,
    icon: Users,
  },
  {
    id: 2,
    title: "Active Employees",
    value: stats.activeEmployees,
    icon: UserCheck,
  },
  {
    id: 3,
    title: "Inactive Employees",
    value: stats.inactiveEmployees,
    icon: UserX,
  },
  {
    id: 4,
    title: "Departments",
    value: stats.totalDepartments,
    icon: Building2,
  },
];
  return (
  <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
    {statCards.map((item) => (
      <StatsCard
        key={item.id}
        title={item.title}
        value={item.value}
        icon={item.icon}
      />
    ))}
  </section>
);
};

export default EmployeeStats;
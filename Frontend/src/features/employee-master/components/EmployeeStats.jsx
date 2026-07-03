import StatsCard from "./StatsCard";
import { employeeStats } from "../data/employeeStats";

const EmployeeStats = () => {
  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {employeeStats.map((item) => (
        <StatsCard
          key={item.id}
          title={item.title}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </section>
  );
};

export default EmployeeStats;
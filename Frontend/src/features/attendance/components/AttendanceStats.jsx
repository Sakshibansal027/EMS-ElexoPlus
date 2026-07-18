import AttendanceStatCard from "./AttendanceStatCard";

const AttendanceStats = ({ statCards }) => {
  return (
    <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((card) => (
        <AttendanceStatCard
          key={card.id}
          label={card.title}
          value={card.value}
          icon={card.icon}
          tone={card.tone}
        />
      ))}
    </section>
  );
};

export default AttendanceStats;
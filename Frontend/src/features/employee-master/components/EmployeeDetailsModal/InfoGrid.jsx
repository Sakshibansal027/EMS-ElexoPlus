import InfoCard from "./InfoCard";

const InfoGrid = ({ items }) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item, index) => (
        <InfoCard
          key={index}
          icon={item.icon}
          label={item.label}
          value={item.value}
        />
      ))}
    </div>
  );
};

export default InfoGrid;
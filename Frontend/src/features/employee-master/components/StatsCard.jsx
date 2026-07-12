const StatsCard = ({ title, value, icon: Icon }) => {
  return (
    <div
      className="
card
group
relative
flex
items-center
justify-between
p-7
min-h-[170px]
transition-all
duration-300
hover:-translate-y-1
hover:border-primary
hover:shadow-primary
">

      <div>
        <p className="text-base text-muted-foreground font-medium">
          {title}
        </p>

        <h2 className="mt-3 text-4xl font-bold tracking-tight">
          {value}
        </h2>
      </div>
      <div
        className="
flex
h-16
w-16
items-center
justify-center
rounded-2xl
bg-primary/10
text-primary
transition-all
duration-300
group-hover:scale-110
group-hover:rotate-6
">
        <Icon
          size={30}
          className="
transition-transform
duration-300
group-hover:scale-110
"
        />

      </div>

    </div>
  );
};

export default StatsCard;
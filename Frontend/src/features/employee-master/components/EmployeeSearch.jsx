import { Search } from "lucide-react";

const EmployeeSearch = ({
  search,
  setSearch
}) => {
  return (
    <div className="relative w-full">
      <Search
        size={20}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-primary)]"
      />

      <input
        type="text"
        placeholder="Search by Name, Employee ID or Email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input w-full rounded-xl py-3 pl-12 pr-4 outline-none"
      />
    </div>
  );
};

export default EmployeeSearch;
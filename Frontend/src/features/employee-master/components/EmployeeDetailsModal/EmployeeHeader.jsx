import { X } from "lucide-react";

const EmployeeHeader = ({ employee, onClose }) => {
    return (
        <div className="relative overflow-hidden rounded-t-3xl border-b border-[var(--color-border)] bg-gradient-to-r from-[#1b1b1b] via-[#202020] to-[#1b1b1b] p-8">

            {/* Golden Glow */}
            <div className="absolute -top-20 -right-20 h-52 w-52 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl" />

            <div className="relative flex items-start justify-between">

                {/* Left */}
                <div className="flex gap-5">

                    {/* Avatar */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-3xl font-bold text-black shadow-lg">
                        {employee.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                    </div>

                    {/* Employee Info */}
                    <div>

                        <div className="flex items-center gap-3 flex-wrap">

                            <h2 className="text-3xl font-bold">
                                {employee.name}
                            </h2>

                            <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold
                ${employee.status === "Active"
                                        ? "bg-green-500/20 text-green-400"
                                        : "bg-red-500/20 text-red-400"
                                    }`}
                            >
                                {employee.status}
                            </span>

                        </div>

                        <p className="mt-2 text-lg text-[var(--color-primary)]">
                            {employee.designation}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">

                            <span className="rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-sm text-[var(--color-primary)]">
                                {employee.code}
                            </span>

                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm">
                                {employee.department}
                            </span>

                            <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm">
                                {employee.employmentType}
                            </span>

                        </div>

                    </div>

                </div>

                {/* Close */}
                <button
                    onClick={onClose}
                    className="rounded-xl p-2 transition hover:bg-zinc-800 hover:text-[var(--color-primary)] cursor-pointer"
                >
                    <X size={26} />
                </button>

            </div>

        </div>
    );
};

export default EmployeeHeader;

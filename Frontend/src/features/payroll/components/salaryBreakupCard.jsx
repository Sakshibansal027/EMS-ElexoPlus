import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#f4c21c",
    "#c89b14",
    "#9b7a10",
    "#ffd54a",
];

const SalaryBreakupCard = ({ payrollData = {} }) => {
    // Safe extraction with fallback defaults
    const salaryBreakup = payrollData?.salaryBreakup || {};
    const deductions = payrollData?.deductions || {};

    const basicSalary = salaryBreakup.basicSalary ?? 0;
    const hra = salaryBreakup.hra ?? 0;
    const allowances = salaryBreakup.allowances ?? 0;
    const incentive = salaryBreakup.incentive ?? 0;

    const gross = basicSalary + hra + allowances + incentive;

    let safeDeductions = { pf: 0, professionalTax: 0, tds: 0, other: 0 };
    if (typeof deductions === "object" && deductions !== null) {
        safeDeductions = {
            pf: Number(deductions.pf || 0),
            professionalTax: Number(deductions.professionalTax || 0),
            tds: Number(deductions.tds || deductions.incomeTax || 0),
            other: Number(deductions.other || 0),
        };
    } else if (typeof deductions === "number") {
        safeDeductions = {
            pf: Math.round(deductions * 0.4),
            professionalTax: Math.round(deductions * 0.1),
            tds: Math.round(deductions * 0.4),
            other: Math.round(deductions * 0.1),
        };
    }

    const totalDeductionVal = safeDeductions.pf + safeDeductions.professionalTax + safeDeductions.tds + safeDeductions.other;
    const displayNetPay = gross - totalDeductionVal;

    const pieData = [
        { name: "Basic Salary", value: basicSalary },
        { name: "HRA", value: hra },
        { name: "Allowances", value: allowances },
        { name: "Incentive", value: incentive },
    ];

    return (
        <div className="card p-5 h-full">
            <h3 className="text-yellow-500 text-sm font-semibold mb-6">
                SALARY BREAKUP
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={1}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="-mt-36 text-center">
                        <p className="text-xs text-muted-foreground">
                            NET PAY
                        </p>
                        <h4 className="text-xl font-bold">
                            ₹{(displayNetPay ?? 0).toLocaleString("en-IN")}
                        </h4>
                    </div>
                </div>

                <div className="space-y-3">
                    <Row label="Basic Salary" value={basicSalary} />
                    <Row label="HRA" value={hra} />
                    <Row label="Allowances" value={allowances} />
                    <Row label="Incentive" value={incentive} />
                    <Row label="Gross Earnings" value={gross} highlight />
                    
                    <Row label="PF" value={safeDeductions.pf} negative />
                    <Row label="Professional Tax" value={safeDeductions.professionalTax} negative />
                    <Row label="Income Tax" value={safeDeductions.tds} negative />
                    <Row label="Other" value={safeDeductions.other} negative />
                    
                    <Row label="Net Pay" value={displayNetPay} highlight />
                </div>
            </div>
        </div>
    );
};

// Safe Row component
const Row = ({ label, value, negative, highlight }) => {
    // Agar value undefined, null ya NaN ho to 0 fallback karenge
    const safeValue = typeof value === "number" && !isNaN(value) ? value : Number(value) || 0;

    return (
        <div className="flex justify-between text-sm">
            <span
                className={
                    highlight
                        ? "text-yellow-500 font-semibold"
                        : negative
                        ? "text-red-400"
                        : ""
                }
            >
                {label}
            </span>

            <span
                className={
                    highlight
                        ? "text-yellow-500 font-semibold"
                        : negative
                        ? "text-red-400"
                        : ""
                }
            >
                {negative ? "-" : ""}₹{safeValue.toLocaleString("en-IN")}
            </span>
        </div>
    );
};

export default SalaryBreakupCard;
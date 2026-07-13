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

const SalaryBreakupCard = ({
    payrollData,
}) => {
    const {
        salaryBreakup,
        deductions,
        netPay,
    } = payrollData;

    const gross =
        salaryBreakup.basicSalary +
        salaryBreakup.hra +
        salaryBreakup.allowances +
        salaryBreakup.incentive;

    const pieData = [
        {
            name: "Basic Salary",
            value:
                salaryBreakup.basicSalary,
        },

        {
            name: "HRA",
            value: salaryBreakup.hra,
        },

        {
            name: "Allowances",
            value:
                salaryBreakup.allowances,
        },

        {
            name: "Incentive",
            value:
                salaryBreakup.incentive,
        },
    ];

    return (
        <div
            className="
                card
                p-5
                h-full
            "
        >
            <h3
                className="
                    text-yellow-500
                    text-sm
                    font-semibold
                    mb-6
                "
            >
                SALARY BREAKUP
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="h-[250px]">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={pieData}
                                dataKey="value"
                                innerRadius={55}
                                outerRadius={80}
                                paddingAngle={1}
                            >
                                {pieData.map(
                                    (
                                        entry,
                                        index
                                    ) => (
                                        <Cell
                                            key={
                                                index
                                            }
                                            fill={
                                                COLORS[
                                                    index
                                                ]
                                            }
                                        />
                                    )
                                )}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>

                    <div
                        className="
                            -mt-36
                            text-center
                        "
                    >
                        <p className="text-xs text-muted-foreground">
                            NET PAY
                        </p>

                        <h4 className="text-xl font-bold">
                            ₹
                            {netPay.toLocaleString()}
                        </h4>
                    </div>
                </div>

                <div className="space-y-3">
                    <Row
                        label="Basic Salary"
                        value={
                            salaryBreakup.basicSalary
                        }
                    />

                    <Row
                        label="HRA"
                        value={
                            salaryBreakup.hra
                        }
                    />

                    <Row
                        label="Allowances"
                        value={
                            salaryBreakup.allowances
                        }
                    />

                    <Row
                        label="Incentive"
                        value={
                            salaryBreakup.incentive
                        }
                    />

                    <Row
                        label="Gross Earnings"
                        value={gross}
                        highlight
                    />

                    <Row
                        label="PF"
                        value={
                            deductions.pf
                        }
                        negative
                    />

                    <Row
                        label="Professional Tax"
                        value={
                            deductions.professionalTax
                        }
                        negative
                    />

                    <Row
                        label="Income Tax"
                        value={
                            deductions.tds
                        }
                        negative
                    />

                    <Row
                        label="Other"
                        value={
                            deductions.other
                        }
                        negative
                    />

                    <Row
                        label="Net Pay"
                        value={netPay}
                        highlight
                    />
                </div>
            </div>
        </div>
    );
};

const Row = ({
    label,
    value,
    negative,
    highlight,
}) => (
    <div className="flex justify-between text-sm">
        <span
            className={
                highlight
                    ? "text-yellow-500"
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
            {negative ? "-" : ""}₹
            {value.toLocaleString()}
        </span>
    </div>
);

export default SalaryBreakupCard;
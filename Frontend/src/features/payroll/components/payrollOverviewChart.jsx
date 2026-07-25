import { useMemo, useState } from "react";
import {
    Listbox,
} from "@headlessui/react";
import {
    ChevronDown,
} from "lucide-react";
import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    LabelList,
    Legend,
} from "recharts";

const PayrollOverviewCard = ({
    payrollHistory,
}) => {
    const [range, setRange] =
        useState("6");

    const chartData = useMemo(() => {
        switch (range) {
            case "3":
                return payrollHistory.slice(-3);

            case "6":
                return payrollHistory.slice(-6);

            case "12":
                return payrollHistory.slice(-12);

            default:
                return payrollHistory;
        }
    }, [range, payrollHistory]);

    return (
        <div className="card p-5 h-[380px]">
            <div className="flex items-center justify-between mb-6">
                <h3
                    className="
                        text-yellow-500
                        text-sm
                        font-semibold
                        uppercase
                    "
                >
                    Payroll Overview
                </h3>

                <div className="relative">
                    <Listbox
                        value={range}
                        onChange={setRange}
                    >
                        <div className="relative w-[180px]">
                            <Listbox.Button
                                className="
                w-full
                flex
                items-center
                justify-between

                rounded-full
                border
                border-yellow-500/40

                bg-[#1b1b1b]
                px-4
                py-2

                text-sm
                text-white
            "
                            >
                                <span>
                                    Last {range} Months
                                </span>

                                <ChevronDown
                                    size={16}
                                    className="
                    text-yellow-500
                "
                                />
                            </Listbox.Button>

                            <Listbox.Options
                                className="
                absolute
                z-50
                mt-2
                w-full

                rounded-2xl
                border
                border-yellow-500/30

                bg-[#181818]
                p-2
            "
                            >
                                <Listbox.Option value="3">
                                    {({ active }) => (
                                        <div
                                            className={`
                            px-4
                            py-2
                            rounded-xl
                            cursor-pointer

                            ${active
                                                    ? "bg-yellow-500/10 text-yellow-500"
                                                    : "text-white"
                                                }
                        `}
                                        >
                                            Last 3 Months
                                        </div>
                                    )}
                                </Listbox.Option>

                                <Listbox.Option value="6">
                                    {({ active }) => (
                                        <div
                                            className={`
                            px-4
                            py-2
                            rounded-xl
                            cursor-pointer

                            ${active
                                                    ? "bg-yellow-500/10 text-yellow-500"
                                                    : "text-white"
                                                }
                        `}
                                        >
                                            Last 6 Months
                                        </div>
                                    )}
                                </Listbox.Option>

                                <Listbox.Option value="12">
                                    {({ active }) => (
                                        <div
                                            className={`
                            px-4
                            py-2
                            rounded-xl
                            cursor-pointer

                            ${active
                                                    ? "bg-yellow-500/10 text-yellow-500"
                                                    : "text-white"
                                                }
                        `}
                                        >
                                            Last 12 Months
                                        </div>
                                    )}
                                </Listbox.Option>
                            </Listbox.Options>
                        </div>
                    </Listbox>
           
                </div>
            </div>

            <div className="h-[290px]">
                <ResponsiveContainer
                    width="100%"
                    height="100%"
                >
                    <ComposedChart
                        data={chartData}
                        barCategoryGap="18%"
                        margin={{
                            top: 20,
                            right: 25,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <defs>
                            <linearGradient
                                id="goldGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#ffd84d"
                                />

                                <stop
                                    offset="100%"
                                    stopColor="#e0ab00"
                                />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            stroke="#252525"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="month"
                            tick={{
                                fill: "#8b8b8b",
                                fontSize: 11,
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            yAxisId="left"
                            tick={{
                                fill: "#7f7f7f",
                                fontSize: 11,
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{
                                fill: "#ef4444",
                                fontSize: 11,
                            }}
                            axisLine={false}
                            tickLine={false}
                        />

                        <Tooltip
                            cursor={{
                                fill: "rgba(255,255,255,0.03)",
                            }}
                            contentStyle={{
                                background:
                                    "#181818",
                                border:
                                    "1px solid #303030",
                                borderRadius:
                                    "12px",
                            }}
                        />

                        <Legend />

                        <Bar
                            yAxisId="left"
                            dataKey="netPay"
                            fill="url(#goldGradient)"
                            radius={[
                                4,
                                4,
                                0,
                                0,
                            ]}
                            barSize={28}
                            name="Net Pay"
                        >
                            <LabelList
                                dataKey="netPay"
                                position="top"
                                fill="#f4c21c"
                                fontSize={11}
                                formatter={(
                                    value
                                ) =>
                                    `₹${(
                                        value /
                                        1000
                                    ).toFixed(
                                        1
                                    )}K`
                                }
                            />
                        </Bar>

                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="deductions"
                            stroke="#ff4040"
                            strokeWidth={2}
                            dot={{
                                fill: "#ff4040",
                                r: 4,
                            }}
                            activeDot={{
                                r: 6,
                            }}
                            name="Deductions"
                        >
                            <LabelList
                                dataKey="deductions"
                                position="top"
                                fill="#ff4040"
                                fontSize={10}
                                formatter={(
                                    value
                                ) =>
                                    `₹${(
                                        value /
                                        1000
                                    ).toFixed(
                                        1
                                    )}K`
                                }
                            />
                        </Line>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PayrollOverviewCard;

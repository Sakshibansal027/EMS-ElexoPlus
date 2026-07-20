import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const LeaveAnalyticsCard = ({
    leaveBalanceData = [],
}) => {
    const chartData = leaveBalanceData.map(
        (item) => ({
            name: item.title,
            value:
                item.total -
                item.available,
        })
    );

    const totalDaysTaken =
        chartData.reduce(
            (sum, item) =>
                sum + item.value,
            0
        );

    const COLORS = [
        "#84cc16",
        "#f59e0b",
        "#3b82f6",
    ];

    return (
        <div className="card p-5">
            <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-lg">
                    Leave Analytics
                </h3>

                <span className="text-xs text-muted-foreground">
                    This Year
                </span>
            </div>

            <div className="flex items-center justify-between gap-4">
                {/* Chart */}

                <div className="w-[180px] h-[180px]">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                innerRadius={45}
                                outerRadius={70}
                                paddingAngle={2}
                                strokeWidth={2}
                            >
                                {chartData.map(
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

                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}

                <div className="flex-1 space-y-4">
                    {chartData.map(
                        (
                            item,
                            index
                        ) => (
                            <div
                                key={
                                    item.name
                                }
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor:
                                                COLORS[
                                                    index
                                                ],
                                        }}
                                    />

                                    <span className="text-sm">
                                        {
                                            item.name
                                        }
                                    </span>
                                </div>

                                <span className="text-sm font-medium text-muted-foreground">
                                    {
                                        item.value
                                    }{" "}
                                    Days
                                </span>
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Bottom */}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/40">
                <span className="text-sm text-muted-foreground">
                    Total Leave Days
                </span>

                <span className="text-2xl font-bold text-primary">
                    {totalDaysTaken}
                </span>
            </div>
        </div>
    );
};

export default LeaveAnalyticsCard;
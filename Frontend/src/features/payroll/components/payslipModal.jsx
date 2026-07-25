import { X } from "lucide-react";

const PayslipModal = ({ data, onClose }) => {
    if (!data) return null;

    const salary = data.salaryBreakup || {};
    const deductions = data.deductions || {};

    const grossSalary =
        (salary.basicSalary || 0) +
        (salary.hra || 0) +
        (salary.allowances || 0) +
        (salary.incentive || 0);

    const totalDeductions =
        (deductions.pf || 0) +
        (deductions.professionalTax || 0) +
        (deductions.tds || 0) +
        (deductions.other || 0);

    const netPay =
        data.netPay ??
        grossSalary - totalDeductions;

    const money = (value) =>
        Number(value || 0).toLocaleString(
            "en-IN"
        );

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                bg-black/65
                backdrop-blur-xs
                flex
                items-center
                justify-center
                p-4
                overflow-hidden
            "
        >
            <button
                onClick={onClose}
                className="
                    absolute
                    top-4
                    right-4
                    z-[60]
                    bg-black/90
                    backdrop-blur-xs
                    rounded-full
                    p-2
                    shadow-lg
                    hover:bg-gray-100
                    transition-colors
                "
            >
                <X size={18} className="text-gray-800" />
            </button>
            <div
                role="dialog"
                aria-modal="true"
                className="
                    relative
                    w-[660px]
                    h-[95vh]
                    max-h-[920px]
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                    flex
                    flex-col
                "
                style={{
                    fontFamily: "system-ui, -apple-system, sans-serif",
                    aspectRatio: "1 / 1.38" /* Vertically standard aspect scale */
                }}
            >
                <img
                    src="https://b2b.elexoplus.in/api/letterhead.jpg"
                    alt="Company Letterhead"
                    className="
                        absolute
                        top-0
                        left-0
                        w-full
                        h-full
                        object-fill
                        pointer-events-none
                        select-none
                        z-0
                    "
                />

                <div
                    className="relative z-10 px-9 pb-10 flex-1 flex flex-col justify-between h-full"
                    style={{ paddingTop: "145px", color: "#000" }}
                >
                    
                    <div className="text-center mb-4">
                        <h1 className="text-[26px] font-black tracking-wider text-gray-900 m-0">
                            PAYSLIP
                        </h1>
                        <p className="text-xs font-bold text-gray-400 mt-0.5 uppercase tracking-wider">
                            {data.month}
                        </p>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-5 my-2 bg-white/80 backdrop-blur-xs">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                            <Info label="Employee Name" value={data.employeeName} />
                            <Info label="Employee ID" value={data.employeeId} />
                            <Info label="Designation" value={data.designation} />
                            <Info label="Department" value={data.department} />
                        </div>
                    </div>

                    {/* Core Segment: Balanced Double Grids */}
                    <div className="grid grid-cols-2 gap-4 my-2 flex-1 items-stretch">
                        <SalaryTable
                            title="Earnings"
                            money={money}
                            rows={[
                                ["Basic Salary", salary.basicSalary],
                                ["HRA", salary.hra],
                                ["Allowances", salary.allowances],
                                ["Incentive", salary.incentive],
                                ["Gross Salary", grossSalary, true],
                            ]}
                        />

                        <SalaryTable
                            title="Deductions"
                            money={money}
                            rows={[
                                ["PF", deductions.pf],
                                ["Professional Tax", deductions.professionalTax],
                                ["TDS", deductions.tds],
                                ["Other", deductions.other],
                                ["Total Deductions", totalDeductions, true],
                            ]}
                        />
                    </div>

                    {/* Bottom Segment: Emphasized Highlight Block & Footer Notes */}
                    <div className="mt-4">
                        <div className="border border-amber-300 bg-amber-50/95 backdrop-blur-xs rounded-xl px-6 py-3.5 flex justify-between items-center mb-6 shadow-sm">
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                                Net Pay
                            </span>
                            <span className="text-2xl font-black text-gray-900">
                                ₹{money(netPay)}
                            </span>
                        </div>

                        <p className="text-center text-[10px] font-semibold text-gray-400 m-0 tracking-wide">
                            This is a computer generated payslip and does not require a signature.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SalaryTable = ({ title, rows, money }) => (
    <div className="w-full border border-gray-200 rounded-xl overflow-hidden bg-white/40 h-full flex flex-col">
        <table className="w-full border-collapse flex-1">
            <thead>
                <tr>
                    <th style={headerStyle}>{title}</th>
                    <th style={{ ...headerStyle, textAlign: "right" }}>
                        Amount (₹)
                    </th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <Row
                        key={index}
                        label={row[0]}
                        value={row[1]}
                        bold={row[2]}
                        money={money}
                    />
                ))}
            </tbody>
        </table>
    </div>
);

const headerStyle = {
    background: "#fef9c3",
    padding: "10px 14px",
    color: "#111827",
    fontWeight: 700,
    textAlign: "left",
    fontSize: "12.5px",
    borderBottom: "1px solid #e5e7eb"
};

const Info = ({ label, value }) => (
    <div>
        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">
            {label}
        </div>
        <div className="text-sm font-bold text-gray-900">
            {value || "-"}
        </div>
    </div>
);

const Row = ({ label, value, bold = false, money }) => (
    <tr className={bold ? "bg-gray-100/60" : ""}>
        <td
            style={{
                borderBottom: "1px solid #f3f4f6",
                padding: "10px 14px",
                color: bold ? "#000" : "#4b5563",
                fontSize: "11.5px",
                fontWeight: bold ? 700 : 500,
            }}
        >
            {label}
        </td>
        <td
            style={{
                borderBottom: "1px solid #f3f4f6",
                padding: "10px 14px",
                textAlign: "right",
                color: bold ? "#000" : "#111827",
                fontSize: "11.5px",
                fontWeight: bold ? 700 : 600,
            }}
        >
            ₹{money(value)}
        </td>
    </tr>
);

export default PayslipModal;

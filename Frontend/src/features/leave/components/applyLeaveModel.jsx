import { useState } from "react";
import Select from "react-select";

import {
    leaveTypeOptions,
} from "../mock/leaveData.js";

const selectStyles = {
    control: (base) => ({
        ...base,
        backgroundColor: "#1d1d1d",
        borderColor: "#303030",
        minHeight: "50px",
        boxShadow: "none",
        borderRadius: "12px",
        color: "#f8f8f8",
    }),

    menu: (base) => ({
        ...base,
        backgroundColor: "#1b1b1b",
        border: "1px solid #303030",
        borderRadius: "12px",
    }),

    option: (base, state) => ({
        ...base,
        backgroundColor: state.isFocused
            ? "#232323"
            : "#1b1b1b",
        color: "#f8f8f8",
        cursor: "pointer",
    }),

    singleValue: (base) => ({
        ...base,
        color: "#f8f8f8",
    }),

    placeholder: (base) => ({
        ...base,
        color: "#909090",
    }),

    input: (base) => ({
        ...base,
        color: "#f8f8f8",
    }),

    indicatorSeparator: () => ({
        display: "none",
    }),
};

const ApplyLeaveModal = ({ onClose }) => {

    const [leaveType, setLeaveType] = useState(null);

    const [dayType, setDayType] = useState("Full Day");
    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    const [reason, setReason] = useState("");

    const [
        emergencyContact,
        setEmergencyContact,
    ] = useState("");

    const [document, setDocument] = useState(null);

    const [errors, setErrors] = useState({});

    const [
        showValidationError,
        setShowValidationError,
    ] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    const handleSubmit = () => {

        const newErrors = {
            leaveType: !leaveType,
            fromDate: !fromDate,
            toDate: !toDate,
            reason: !reason.trim(),
            emergencyContact:
                !/^[0-9]{10}$/.test(
                    emergencyContact
                ),
        };

        if (
            fromDate &&
            toDate &&
            new Date(toDate) <
                new Date(fromDate)
        ) {
            newErrors.toDate = true;
        }

        if (
            dayType === "Half Day" &&
            fromDate !== toDate
        ) {
            newErrors.dayType = true;
        }
        setErrors(newErrors);

        const hasErrors =
            Object.values(newErrors)
                .some(Boolean);

        if (hasErrors) {
            setShowValidationError(true);
            return;
        }

        setShowValidationError(false);

        if (
            leaveType?.value === "SL" &&
            !document
        ) {
            newErrors.document = true;
        }

        alert(
            "Leave submitted successfully"
        );

        onClose();
    };

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
            "
        >
            {/* Overlay */}
            <div
                className="
                    absolute
                    inset-0
                    bg-black/60
                    backdrop-blur-sm
                "
                onClick={onClose}
            />

            {/* Modal */}
           <div
                className="
                    relative
                    w-full
                    max-w-3xl
                    card
                    p-8
                    z-10
                    max-h-[90vh]
                    overflow-y-auto
                    custom-scrollbar
                "
            >
                {/* Header */}
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        mb-8
                    "
                >
                    <h2
                        className="
                            heading-primary
                            text-3xl
                        "
                    >
                        <span className="text-primary">
                            Apply
                        </span>{" "}
                        For Leave
                    </h2>

                    <button
                        onClick={onClose}
                        className="
                            text-2xl
                            text-muted-foreground
                            hover:text-foreground
                            transition-all
                        "
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">

                    {showValidationError && (
                        <div
                            className="
                                rounded-xl
                                border
                                border-red-500/20
                                bg-red-500/10
                                px-4
                                py-3
                                text-sm
                                text-red-300
                            "
                        >
                            Please fill all required fields correctly.
                        </div>
                    )}

                    {/* Employee */}
                    <div
                        className="
                            card
                            p-4
                            flex
                            items-center
                            justify-between
                        "
                    >
                        <div>
                            <h3
                                className="
                                    heading-primary
                                    text-lg
                                "
                            >
                                Rahul Sharma
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-muted-foreground
                                    mt-1
                                "
                            >
                                Admin
                            </p>
                        </div>

                        <span
                            className="
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                bg-[rgba(244,194,28,.12)]
                                text-primary
                                border
                                border-[rgba(244,194,28,.2)]
                            "
                        >
                            EMP001
                        </span>
                    </div>

                    {/* Leave Type + Dates */}
                    <div
                        className="
                            grid
                            md:grid-cols-3
                            gap-4
                        "
                    >
                        <Select
                            options={leaveTypeOptions}
                            value={leaveType}
                            onChange={(selected) => {

                                setLeaveType(selected);

                                if (
                                    selected?.value !== "SL"
                                ) {
                                    setDocument(null);
                                }

                                setErrors((prev) => ({
                                    ...prev,
                                    leaveType: false,
                                    document: false,
                                }));
                            }}
                            placeholder="Select leave type..."
                            styles={{
                                ...selectStyles,
                                control: (base) => ({
                                    ...selectStyles.control(base),
                                    borderColor:
                                        errors.leaveType
                                            ? "#ef4444"
                                            : "#303030",
                                }),
                            }}
                        />

                        <input
                            type="date"
                            value={fromDate}
                            min={today}
                            onChange={(event) => {

                                const value = event.target.value;
                                setFromDate(value);

                                if (
                                    toDate &&
                                    value !== toDate
                                ) {
                                    setDayType("Full Day");
                                }

                                setErrors((prev) => ({
                                    ...prev,
                                    fromDate: false,
                                }));
                            }}
                            className={`
                                input
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                ${
                                    errors.fromDate
                                        ? "border-red-500"
                                        : ""
                                }
                            `}
                        />

                        <input
                            type="date"
                            value={toDate}
                            min={fromDate || today}
                            onChange={(event) => {

                                const value =
                                    event.target.value;

                                setToDate(value);

                                if (
                                    fromDate &&
                                    value !== fromDate
                                ) {
                                    setDayType("Full Day");
                                }

                                setErrors((prev) => ({
                                    ...prev,
                                    toDate: false,
                                }));
                            }}
                            className={`
                                input
                                w-full
                                px-4
                                py-3
                                rounded-lg
                                ${
                                    errors.toDate
                                        ? "border-red-500"
                                        : ""
                                }
                            `}
                        />
                    </div>

                    {/* Leave Duration */}
                <div>
                    <label
                        className="
                            block
                            text-sm
                            text-muted-foreground
                            mb-2
                        "
                    >
                        Leave Duration
                    </label>

                    <select
                        value={dayType}
                        onChange={(event) =>
                            setDayType(
                                event.target.value
                            )
                        }
                        disabled={
                            fromDate &&
                            toDate &&
                            fromDate !== toDate
                        }
                        className="
                            input
                            w-full
                            px-4
                            py-3
                            rounded-lg
                        "
                    >
                        <option value="Full Day">
                            Full Day
                        </option>

                        <option value="Half Day">
                            Half Day
                        </option>
                    </select>
                        {errors.dayType && (
                            <p className="text-red-400 text-xs mt-2">
                                Half Day leave is only allowed for a single day.
                            </p>
                        )}
                    {fromDate &&
                        toDate &&
                        fromDate !== toDate && (
                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                    mt-2
                                "
                            >
                                Half Day leave is only
                                available for a single day.
                            </p>
                        )}
                </div>
                    {/* Reason */}
                    <textarea
                        rows="4"
                        value={reason}
                        onChange={(event) => {

                            setReason(
                                event.target.value
                            );

                            setErrors((prev) => ({
                                ...prev,
                                reason: false,
                            }));
                        }}
                        placeholder="Enter leave reason..."
                        className={`
                            input
                            w-full
                            px-4
                            py-3
                            rounded-lg
                            resize-none
                            ${
                                errors.reason
                                    ? "border-red-500"
                                    : ""
                            }
                        `}
                    />

                    {/* Emergency Contact */}
                    <input
                        type="tel"
                        maxLength={10}
                        value={emergencyContact}
                        onChange={(event) => {

                            const value =
                                event.target.value.replace(
                                    /\D/g,
                                    ""
                                );

                            setEmergencyContact(value);

                            setErrors((prev) => ({
                                ...prev,
                                emergencyContact: false,
                            }));
                        }}
                        placeholder="Emergency Contact Number"
                        className={`
                            input
                            w-full
                            px-4
                            py-3
                            rounded-lg
                            ${
                                errors.emergencyContact
                                    ? "border-red-500"
                                    : ""
                            }
                        `}
                    />

                    {errors.emergencyContact && (
                        <p className="text-red-400 text-xs">
                            Enter a valid 10-digit emergency contact number.
                        </p>
                    )}

                    {/* Sick Leave Document */}
                    {(leaveType?.value === "SL" || leaveType?.value === "ML" ||leaveType?.value === "PL") && (
                        <div>
                            <label
                                className="
                                    block
                                    text-sm
                                    font-medium
                                    mb-2
                                "
                            >
                                Medical Certificate
                            </label>

                            <label
                                className={`
                                    flex
                                    items-center
                                    justify-between
                                    px-4
                                    py-3
                                    rounded-xl
                                    border
                                    cursor-pointer
                                    transition-all
                                    ${
                                        errors.document
                                            ? "border-red-500"
                                            : "border-\[\#303030\]"
                                    }
                                `}
                            >
                                <span
                                    className="
                                        text-sm
                                        text-muted-foreground
                                        truncate
                                    "
                                >
                                    {document
                                        ? document.name
                                        : "Upload medical certificate"}
                                </span>

                                <span
                                    className="
                                        px-3
                                        py-1
                                        rounded-lg
                                        bg-primary
                                        text-black
                                        text-xs
                                        font-medium
                                    "
                                >
                                    Browse
                                </span>

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                    onChange={(event) => {
                                        setDocument(
                                            event.target.files?.[0]
                                        );

                                        setErrors((prev) => ({
                                            ...prev,
                                            document: false,
                                        }));
                                    }}
                                />
                            </label>

                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                    mt-2
                                "
                            >
                                Medical certificate is required
                                for Medical Leave.
                            </p>

                            {errors.document && (
                                <p
                                    className="
                                        text-red-400
                                        text-xs
                                        mt-2
                                    "
                                >
                                    Medical certificate is
                                    required.
                                </p>
                            )}
                        </div>
                    )}

                    {/* Footer */}
                    <div
                        className="
                            flex
                            justify-end
                            gap-3
                            pt-2
                        "
                    >
                        <button
                            onClick={onClose}
                            className="
                                card
                                px-5
                                py-3
                                text-sm
                            "
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="
                                btn-primary
                                px-6
                                py-3
                                text-sm
                                font-medium
                            "
                        >
                            Submit Leave
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ApplyLeaveModal;
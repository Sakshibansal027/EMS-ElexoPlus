import Select from "react-select";

import {
    applyLeaveMessages,
    leaveDurationOptions,
} from "../config/applyLeaveForm.js";
import {
    leaveTypeOptions,
} from "../config/leaveOptions.js";
import { selectStyles } from "../config/leaveStyles.js";

const ApplyLeaveModal = ({ employee, onClose, form }) => {
    const {
        leaveType,
        dayType,
        fromDate,
        toDate,
        reason,
        emergencyContact,
        document,
        errors,
        showValidationError,
        today,
        requiresMedicalDocument,
        isHalfDayDisabled,
        showHalfDayUnavailable,
        setDayType,
        setReason,
        updateLeaveType,
        updateFromDate,
        updateToDate,
        updateEmergencyContact,
        updateDocument,
        clearError,
        submit,
    } = form;

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
                            {applyLeaveMessages.validation}
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
                                {employee.name}
                            </h3>

                            <p
                                className="
                                    text-sm
                                    text-muted-foreground
                                    mt-1
                                "
                            >
                                {employee.designation ?? employee.role}
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
                            {employee.employeeId}
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
                            onChange={updateLeaveType}
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

                                updateFromDate(event.target.value);
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

                                updateToDate(event.target.value);
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
                        disabled={isHalfDayDisabled}
                        className="
                            input
                            w-full
                            px-4
                            py-3
                            rounded-lg
                        "
                    >
                        {leaveDurationOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                        {errors.dayType && (
                            <p className="text-red-400 text-xs mt-2">
                                {applyLeaveMessages.halfDay}
                            </p>
                        )}
                    {showHalfDayUnavailable && (
                            <p
                                className="
                                    text-xs
                                    text-muted-foreground
                                    mt-2
                                "
                            >
                                {applyLeaveMessages.halfDayUnavailable}
                            </p>
                        )}
                </div>
                    {/* Reason */}
                    <textarea
                        rows="4"
                        value={reason}
                        onChange={(event) => {

                            setReason(event.target.value);
                            clearError("reason");
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

                            updateEmergencyContact(event.target.value);
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
                            {applyLeaveMessages.invalidContact}
                        </p>
                    )}

                    {/* Sick Leave Document */}
                    {requiresMedicalDocument && (
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
                                        updateDocument(event.target.files?.[0]);
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
                                {applyLeaveMessages.medicalCertificateHint}
                            </p>

                            {errors.document && (
                                <p
                                    className="
                                        text-red-400
                                        text-xs
                                        mt-2
                                    "
                                >
                                    {applyLeaveMessages.medicalCertificateRequired}
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
                            onClick={submit}
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

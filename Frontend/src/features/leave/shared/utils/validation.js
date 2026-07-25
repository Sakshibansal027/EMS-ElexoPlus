import { medicalDocumentLeaveTypes } from "../../config/applyLeaveForm.js";

const isTenDigitPhone = (value) => /^[0-9]{10}$/.test(value);

export const sanitizePhoneNumber = (value) => value.replace(/\D/g, "");

export const isMedicalDocumentRequired = (leaveTypeValue) =>
    medicalDocumentLeaveTypes.includes(leaveTypeValue);

export const validateLeaveApplication = ({
    leaveType,
    dayType,
    fromDate,
    toDate,
    reason,
    emergencyContact,
    document,
}) => {
    const errors = {
        leaveType: !leaveType,
        fromDate: !fromDate,
        toDate: !toDate,
        reason: !reason.trim(),
        emergencyContact: !isTenDigitPhone(emergencyContact),
    };

    if (fromDate && toDate && new Date(toDate) < new Date(fromDate)) {
        errors.toDate = true;
    }

    if (dayType === "Half Day" && fromDate !== toDate) {
        errors.dayType = true;
    }

    if (isMedicalDocumentRequired(leaveType?.value) && !document) {
        errors.document = true;
    }

    return errors;
};

export const hasValidationErrors = (errors) => Object.values(errors).some(Boolean);

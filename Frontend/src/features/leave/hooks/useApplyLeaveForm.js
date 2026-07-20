import { useMemo, useState } from "react";

import { submitLeaveApplication } from "../services/leaveService.js";
import { getTodayInputValue } from "../shared/utils/date.js";
import {
    hasValidationErrors,
    isMedicalDocumentRequired,
    sanitizePhoneNumber,
    validateLeaveApplication,
} from "../shared/utils/validation.js";
import { applyLeaveMessages } from "../config/applyLeaveForm.js";

export const useApplyLeaveForm = ({ onSuccess }) => {
    const [leaveType, setLeaveType] = useState(null);
    const [dayType, setDayType] = useState("Full Day");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [document, setDocument] = useState(null);
    const [errors, setErrors] = useState({});
    const [showValidationError, setShowValidationError] = useState(false);

    const today = useMemo(() => getTodayInputValue(), []);
    const requiresMedicalDocument = isMedicalDocumentRequired(leaveType?.value);
    const isHalfDayDisabled = Boolean(fromDate && toDate && fromDate !== toDate);
    const showHalfDayUnavailable = Boolean(fromDate && toDate && fromDate !== toDate);

    const clearError = (field) => {
        setErrors((current) => ({
            ...current,
            [field]: false,
        }));
    };

    const updateLeaveType = (selected) => {
        setLeaveType(selected);

        if (!isMedicalDocumentRequired(selected?.value)) {
            setDocument(null);
        }

        setErrors((current) => ({
            ...current,
            leaveType: false,
            document: false,
        }));
    };

    const updateFromDate = (value) => {
        setFromDate(value);

        if (toDate && value !== toDate) {
            setDayType("Full Day");
        }

        clearError("fromDate");
    };

    const updateToDate = (value) => {
        setToDate(value);

        if (fromDate && value !== fromDate) {
            setDayType("Full Day");
        }

        clearError("toDate");
    };

    const updateEmergencyContact = (value) => {
        setEmergencyContact(sanitizePhoneNumber(value));
        clearError("emergencyContact");
    };

    const updateDocument = (file) => {
        setDocument(file);
        clearError("document");
    };

    const submit = async () => {
        const nextErrors = validateLeaveApplication({
            leaveType,
            dayType,
            fromDate,
            toDate,
            reason,
            emergencyContact,
            document,
        });

        setErrors(nextErrors);

        if (hasValidationErrors(nextErrors)) {
            setShowValidationError(true);
            return;
        }

        setShowValidationError(false);

        await submitLeaveApplication({
            leaveType,
            dayType,
            fromDate,
            toDate,
            reason,
            emergencyContact,
            document,
        });

        alert(applyLeaveMessages.success);
        onSuccess();
    };

    return {
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
    };
};

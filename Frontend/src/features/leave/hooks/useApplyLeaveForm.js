import { useMemo, useState } from "react";

import { submitLeaveApplication } from "../services/leaveService.js";
import { getTodayInputValue } from "../shared/utils/date.js";
import { hasValidationErrors, sanitizePhoneNumber, validateLeaveApplication } from "../shared/utils/validation.js";
import { applyLeaveMessages } from "../config/applyLeaveForm.js";

export const useApplyLeaveForm = ({ employee, onSuccess, policies = [] }) => {
    const [leaveType, setLeaveType] = useState(null);
    const [dayType, setDayType] = useState("Full Day");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [reason, setReason] = useState("");
    const [emergencyContact, setEmergencyContact] = useState("");
    const [document, setDocument] = useState(null);
    const [errors, setErrors] = useState({});
    const [showValidationError, setShowValidationError] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = useMemo(() => getTodayInputValue(), []);
    const leaveTypeOptions = policies.map((policy) => ({
        value: policy.leaveTypeCode,
        label: policy.leaveTypeName,
        id: policy.id,
        allowHalfDay: policy.allowHalfDay,
        requiresDocument: policy.requiresDocument,
    }));
    const requiresMedicalDocument = Boolean(leaveType?.requiresDocument);
    const isHalfDayDisabled = !leaveType?.allowHalfDay || Boolean(fromDate && toDate && fromDate !== toDate);
    const showHalfDayUnavailable = Boolean(fromDate && toDate && fromDate !== toDate);

    const clearError = (field) => {
        setErrors((current) => ({
            ...current,
            [field]: false,
        }));
    };

    const updateLeaveType = (selected) => {
        setLeaveType(selected);

        if (!selected?.requiresDocument) {
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
        if (leaveTypeOptions.length === 0) {
            setSubmitError("No active leave policy is available. Please contact HR or an administrator.");
            setShowValidationError(false);
            return;
        }

        const nextErrors = validateLeaveApplication({
            leaveType,
            dayType,
            fromDate,
            toDate,
            reason,
            emergencyContact,
            document,
            requiresDocument: Boolean(leaveType?.requiresDocument),
        });

        setErrors(nextErrors);

        if (hasValidationErrors(nextErrors)) {
            setShowValidationError(true);
            return;
        }

        setShowValidationError(false);

        try {
            setIsSubmitting(true);
            setSubmitError("");
            await submitLeaveApplication({ leaveType, dayType, fromDate, toDate, reason, emergencyContact, document, employee });
            alert(applyLeaveMessages.success);
            onSuccess();
        } catch (error) {
            setSubmitError(error?.response?.data?.message || error?.message || "Unable to submit the leave request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        leaveType,
        leaveTypeOptions,
        dayType,
        fromDate,
        toDate,
        reason,
        emergencyContact,
        document,
        errors,
        showValidationError,
        submitError,
        isSubmitting,
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

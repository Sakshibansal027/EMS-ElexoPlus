import { useState, useEffect, useCallback } from "react";
import { payrollService } from "../services/payrollService";

const errorMessage = (error, fallback) =>
  payrollService.getErrorMessage(error, fallback);

export const useSalaryStructure = () => {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  // Modal & Form States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [structData, empData] = await Promise.all([
        payrollService.getSalaryStructures(),
        payrollService.getEmployees(),
      ]);
      setStructures(structData?.data || structData || []);
      setEmployees(empData?.data || empData || []);
      setError("");
    } catch (err) {
      console.error("Error fetching salary structures:", err);
      setError(errorMessage(err, "Unable to load salary structures."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Modal Open Handlers
  const openCreateModal = () => {
    setSelectedStructure(null);
    setFormData({
      name: "",
      code: "",
      basicPercentage: "",
      hraPercentage: "",
      specialAllowance: "",
      medicalAllowance: "",
      conveyanceAllowance: "",
      bonusType: "Fixed",
      bonusValue: "",
      bonusFrequency: "Monthly",
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (structure) => {
    setSelectedStructure(structure);
    setFormError("");
    setFormData({
      id: structure.id || structure._id,
      name: structure.name || "",
      code: structure.code || "",
      basicPercentage: structure.basicPercentage || "",
      hraPercentage: structure.hraPercentage || "",
      specialAllowance: structure.specialAllowance ?? structure.allowances?.specialAllowance ?? "",
      medicalAllowance: structure.medicalAllowance ?? structure.allowances?.medicalAllowance ?? "",
      conveyanceAllowance: structure.conveyanceAllowance ?? structure.allowances?.conveyanceAllowance ?? "",
      bonusType: structure.bonusType ?? structure.bonus?.type ?? "Fixed",
      bonusValue: structure.bonusValue ?? structure.bonus?.value ?? "",
      bonusFrequency: structure.bonusFrequency ?? structure.bonus?.frequency ?? "Monthly",
      status: structure.status || "Active",
    });
    setIsFormModalOpen(true);
  };

  const openAssignModal = async (structure) => {
    setError("");
    setSelectedStructure(structure);
    setSelectedEmpIds(structure.assignedEmployees || []);
    setIsAssignModalOpen(true);

    try {
      const detail = await payrollService.getSalaryStructureDetail(structure.id || structure._id);
      const assignedEmployees = (detail.assignments || []).map((assignment) => assignment.employee_id);
      setSelectedStructure(detail.structure);
      setSelectedEmpIds(assignedEmployees);
    } catch (err) {
      setError(errorMessage(err, "Unable to load current salary-structure assignments."));
    }
  };

  // Form Field Changers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === "" ? "" : Number(value),
    }));
  };

  const toggleEmployeeSelection = (empId) => {
    setSelectedEmpIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  // Save Operations
  const handleSaveStructure = async (e) => {
    e.preventDefault();
    setFormError("");

    const formattedPayload = {
      id: formData.id || undefined,
      name: formData.name,
      code: formData.code ? formData.code.toUpperCase() : "",
      basicPercentage: formData.basicPercentage,
      hraPercentage: formData.hraPercentage,
      specialAllowance: formData.specialAllowance || 0,
      medicalAllowance: formData.medicalAllowance || 0,
      conveyanceAllowance: formData.conveyanceAllowance || 0,
      bonusType: formData.bonusType,
      bonusValue: formData.bonusValue || 0,
      bonusFrequency: formData.bonusFrequency,
      assignedEmployees: selectedStructure ? (selectedStructure.assignedEmployees || []) : [],
      assignedCount: selectedStructure ? (selectedStructure.assignedCount || 0) : 0,
    };

    if (!formattedPayload.name || !formattedPayload.code) {
      setFormError("Structure name and code are required.");
      return;
    }
    if (
      Number(formattedPayload.basicPercentage) < 0 ||
      Number(formattedPayload.basicPercentage) > 100 ||
      Number(formattedPayload.hraPercentage) < 0 ||
      Number(formattedPayload.hraPercentage) > 100
    ) {
      setFormError("Basic and HRA percentages must be between 0 and 100.");
      return;
    }
    if (Number(formattedPayload.basicPercentage) + Number(formattedPayload.hraPercentage) > 100) {
      setFormError("Basic and HRA percentages together cannot exceed 100%.");
      return;
    }
    if (
      [formattedPayload.specialAllowance, formattedPayload.medicalAllowance, formattedPayload.conveyanceAllowance, formattedPayload.bonusValue]
        .some((value) => Number(value) < 0)
    ) {
      setFormError("Allowances and bonus value cannot be negative.");
      return;
    }

    setSaving(true);
    try {
      await payrollService.saveSalaryStructure(formattedPayload);
      await fetchData();
      setIsFormModalOpen(false);
    } catch (err) {
      setFormError(errorMessage(err, "Unable to save the salary structure."));
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAssignment = async () => {
    if (!selectedStructure) return;
    const structId = selectedStructure.id || selectedStructure._id;

    if (!selectedEmpIds.length) {
      setError("Select at least one employee before saving assignments.");
      return;
    }

    setSaving(true);
    try {
      await payrollService.assignStructureToEmployees(structId, selectedEmpIds);
      await fetchData();
      setIsAssignModalOpen(false);
    } catch (err) {
      setError(errorMessage(err, "Unable to assign the salary structure."));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteStructure = async (id) => {
    if (window.confirm("Are you sure you want to delete this structure?")) {
      setSaving(true);
      try {
        await payrollService.deleteSalaryStructure(id);
        await fetchData();
      } catch (err) {
        setError(errorMessage(err, "Unable to delete this salary structure."));
      } finally {
        setSaving(false);
      }
    }
  };

  return {
    structures,
    employees,
    loading,
    saving,
    error,
    formError,
    isFormModalOpen,
    isAssignModalOpen,
    selectedStructure,
    formData,
    selectedEmpIds,
    openCreateModal,
    openEditModal,
    openAssignModal,
    closeModals: () => {
      setIsFormModalOpen(false);
      setIsAssignModalOpen(false);
      setFormError("");
    },
    handleInputChange,
    handleNumberInputChange,
    toggleEmployeeSelection,
    handleSaveStructure,
    handleSaveAssignment,
    handleDeleteStructure,
    refresh: fetchData,
  };
};

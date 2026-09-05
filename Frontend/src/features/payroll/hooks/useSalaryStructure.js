import { useState, useEffect } from "react";
import { payrollService } from "../services/payrollService";

export const useSalaryStructure = () => {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal & Form States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [structData, empData] = await Promise.all([
        payrollService.getSalaryStructures(),
        payrollService.getEmployees(),
      ]);
      setStructures(structData?.data || structData || []);
      setEmployees(empData?.data || empData || []);
    } catch (err) {
      console.error("Error fetching salary structures:", err);
    } finally {
      setLoading(false);
    }
  };

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
      bonusType: "Performance",
      bonusValue: "",
      bonusFrequency: "Monthly",
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (structure) => {
    setSelectedStructure(structure);
    setFormData({
      id: structure.id || structure._id,
      name: structure.name || "",
      code: structure.code || "",
      basicPercentage: structure.basicPercentage || "",
      hraPercentage: structure.hraPercentage || "",
      specialAllowance: structure.allowances?.specialAllowance || "",
      medicalAllowance: structure.allowances?.medicalAllowance || "",
      conveyanceAllowance: structure.allowances?.conveyanceAllowance || "",
      bonusType: structure.bonus?.type || "Performance",
      bonusValue: structure.bonus?.value || "",
      bonusFrequency: structure.bonus?.frequency || "Monthly",
    });
    setIsFormModalOpen(true);
  };

  const openAssignModal = (structure) => {
    setSelectedStructure(structure);
    setSelectedEmpIds(structure.assignedEmployees || []);
    setIsAssignModalOpen(true);
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

    const formattedPayload = {
      id: formData.id || undefined,
      name: formData.name,
      code: formData.code ? formData.code.toUpperCase() : "",
      basicPercentage: formData.basicPercentage,
      hraPercentage: formData.hraPercentage,
      specialAllowance: formData.specialAllowance || 0,
      medicalAllowance: formData.medicalAllowance || 0,
      conveyanceAllowance: formData.conveyanceAllowance || 0,
      bonusType: formData.bonusType === "Performance" ? "Fixed" : formData.bonusType,
      bonusValue: formData.bonusValue || 0,
      bonusFrequency: formData.bonusFrequency,
      assignedEmployees: selectedStructure ? (selectedStructure.assignedEmployees || []) : [],
      assignedCount: selectedStructure ? (selectedStructure.assignedCount || 0) : 0,
    };

    await payrollService.saveSalaryStructure(formattedPayload);
    await fetchData();

    setIsFormModalOpen(false);
  };

  const handleSaveAssignment = async () => {
    if (!selectedStructure) return;
    const structId = selectedStructure.id || selectedStructure._id;

    await payrollService.assignStructureToEmployees(structId, selectedEmpIds);

    await fetchData();

    setIsAssignModalOpen(false);
  };

  const handleDeleteStructure = async (id) => {
    if (window.confirm("Are you sure you want to delete this structure?")) {
      await payrollService.deleteSalaryStructure(id);
      await fetchData();
    }
  };

  return {
    structures,
    employees,
    loading,
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
    },
    handleInputChange,
    handleNumberInputChange,
    toggleEmployeeSelection,
    handleSaveStructure,
    handleSaveAssignment,
    handleDeleteStructure,
  };
};

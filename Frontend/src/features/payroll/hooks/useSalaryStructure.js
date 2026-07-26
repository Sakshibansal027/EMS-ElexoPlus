import { useState, useEffect } from "react";
import { adminService } from "../services/adminService";

export const useSalaryStructure = () => {
  const [structures, setStructures] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Active Edit States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState(null);

  const initialFormState = {
    id: "",
    name: "",
    code: "",
    basicPercentage: 50,
    hraPercentage: 40,
    specialAllowance: 0,
    medicalAllowance: 0,
    conveyanceAllowance: 0,
    bonusType: "Performance",
    bonusValue: 0,
    bonusFrequency: "Monthly",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [structData, empData] = await Promise.all([
        adminService.getSalaryStructures(),
        adminService.getEmployees(),
      ]);
      setStructures(structData || []);
      setEmployees(empData || []);
    } catch (err) {
      console.error("Error fetching salary structures:", err);
    } finally {
      setLoading(false);
    }
  };

  // Modal Triggers
  const openCreateModal = () => {
    setSelectedStructure(null);
    setFormData(initialFormState);
    setIsFormModalOpen(true);
  };

  const openEditModal = (struct) => {
    setSelectedStructure(struct);
    const structId = struct.id || struct._id;
    const allowances = struct.allowances || {};
    const bonus = struct.bonus || {};

    setFormData({
      id: structId,
      name: struct.name || "",
      code: struct.code || "",
      basicPercentage: struct.basicPercentage ?? 50,
      hraPercentage: struct.hraPercentage ?? 40,
      specialAllowance: allowances.specialAllowance ?? struct.specialAllowance ?? 0,
      medicalAllowance: allowances.medicalAllowance ?? struct.medicalAllowance ?? 0,
      conveyanceAllowance: allowances.conveyanceAllowance ?? struct.conveyanceAllowance ?? 0,
      bonusType: bonus.type || struct.bonusType || "Performance",
      bonusValue: bonus.value ?? struct.bonusValue ?? 0,
      bonusFrequency: bonus.frequency || struct.bonusFrequency || "Monthly",
    });
    setIsFormModalOpen(true);
  };

  const openAssignModal = (struct) => {
    setSelectedStructure(struct);
    const structId = struct.id || struct._id;
    
    // Check assigned employees from structure or employee list
    const currentAssigned = struct.assignedEmployees 
      ? struct.assignedEmployees 
      : employees.filter((e) => e.currentStructureId === structId || e.structureId === structId).map((e) => e.id || e._id);

    setSelectedEmpIds(currentAssigned);
    setIsAssignModalOpen(true);
  };

  // Input Handlers
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumberInputChange = (field, value) => {
    const parsed = value === "" ? "" : Number(value);
    setFormData((prev) => ({ ...prev, [field]: parsed }));
  };

  const toggleEmployeeSelection = (empId) => {
    setSelectedEmpIds((prev) =>
      prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]
    );
  };

  // ⚡ INSTANT UI UPDATE ACTIONS

  // 1. CREATE / EDIT STRUCTURE
  const handleSaveStructure = async (e) => {
    e.preventDefault();

    const formattedPayload = {
      id: formData.id || `struct_${Date.now()}`,
      name: formData.name,
      code: formData.code.toUpperCase(),
      basicPercentage: formData.basicPercentage,
      hraPercentage: formData.hraPercentage,
      allowances: {
        specialAllowance: formData.specialAllowance,
        medicalAllowance: formData.medicalAllowance,
        conveyanceAllowance: formData.conveyanceAllowance,
      },
      bonus: {
        type: formData.bonusType,
        value: formData.bonusValue,
        frequency: formData.bonusFrequency,
      },
      assignedEmployees: selectedStructure ? (selectedStructure.assignedEmployees || []) : [],
      assignedCount: selectedStructure ? (selectedStructure.assignedCount || 0) : 0,
    };

    // API Call
    await adminService.saveSalaryStructure(formattedPayload);

    // Dynamic UI Update State
    setStructures((prev) => {
      const exists = prev.some((s) => (s.id || s._id) === formattedPayload.id);
      if (exists) {
        // Edit Mode: Replace updated object
        return prev.map((s) => ((s.id || s._id) === formattedPayload.id ? formattedPayload : s));
      } else {
        // Create Mode: Append new object to array
        return [formattedPayload, ...prev];
      }
    });

    setIsFormModalOpen(false);
  };

  // 2. ASSIGN EMPLOYEES TO STRUCTURE
  const handleSaveAssignment = async () => {
    if (!selectedStructure) return;
    const structId = selectedStructure.id || selectedStructure._id;

    await adminService.assignStructureToEmployees(structId, selectedEmpIds);

    // Dynamic UI Update for Assigned Employees Count
    setStructures((prev) =>
      prev.map((s) => {
        if ((s.id || s._id) === structId) {
          return {
            ...s,
            assignedEmployees: selectedEmpIds,
            assignedCount: selectedEmpIds.length,
          };
        }
        return s;
      })
    );

    setIsAssignModalOpen(false);
  };

  // 3. DELETE STRUCTURE
  const handleDeleteStructure = async (id) => {
    if (window.confirm("Are you sure you want to delete this structure?")) {
      await adminService.deleteSalaryStructure(id);

      // Dynamic UI Removal
      setStructures((prev) => prev.filter((s) => (s.id || s._id) !== id));
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
import React from "react";
import { Plus, Edit2, UserCheck, X, Check, Users, Building2, Trash2 } from "lucide-react";
import { useSalaryStructure } from "../hooks/useSalaryStructure";
import { CustomDropdown } from "./ui/CustomDropdown"

export const SalaryStructureManager = () => {
  const {
    structures = [],
    employees = [],
    loading,
    isFormModalOpen,
    isAssignModalOpen,
    selectedStructure,
    formData,
    selectedEmpIds,
    openCreateModal,
    openEditModal,
    openAssignModal,
    closeModals,
    handleInputChange,
    handleNumberInputChange,
    toggleEmployeeSelection,
    handleSaveStructure,
    handleSaveAssignment,
    handleDeleteStructure,
  } = useSalaryStructure();

  if (loading) {
    return (
      <div className="p-8 text-center text-xs font-semibold text-[var(--color-foreground-muted)] animate-pulse">
        Loading Structures...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <div className="card p-5 border border-[var(--color-border)] rounded-2xl bg-[var(--color-background-elevated)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)] flex items-center gap-2">
            <Building2 className="w-4 h-4" /> Salary Structure Management
          </h2>
          <p className="text-xs text-[var(--color-foreground-muted)] mt-1 font-medium">
            Configure Basic, HRA, Allowances, Bonus rules and assign to workforce.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] hover:opacity-90 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-[var(--color-primary)]/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Create Structure
        </button>
      </div>

      {/* CARDS GRID */}
      {structures.length === 0 ? (
        <div className="card p-12 border border-[var(--color-border)] text-center rounded-2xl text-xs text-[var(--color-foreground-muted)] bg-[var(--color-background-elevated)]">
          <p className="font-semibold text-sm text-[var(--color-foreground)] mb-1">No Structures Created</p>
          <p>Click "Create Structure" to set up your first salary tier.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {structures.map((struct) => {
            const structId = struct.id || struct._id;
            const allowances = struct.allowances || {};
            const bonus = struct.bonus || {};
            const dynamicAssignedCount = struct.assignedEmployees?.length ?? struct.assignedCount ?? 0;

            return (
              <div
                key={structId || struct.code}
                className="card p-5 border border-[var(--color-border)] rounded-2xl space-y-4 bg-[var(--color-background-elevated)] relative hover:border-[var(--color-primary)]/40 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-[var(--color-foreground)] tracking-tight">
                      {struct.name || "Unnamed Structure"}
                    </h3>
                    <span className="inline-block text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--color-muted)] text-[var(--color-foreground-muted)] font-semibold border border-[var(--color-border)]/50">
                      {struct.code || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(struct)}
                      className="p-2 rounded-xl hover:bg-[var(--color-card-hover)] text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition cursor-pointer"
                      title="Edit Structure"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openAssignModal(struct)}
                      className="p-2 rounded-xl hover:bg-[var(--color-card-hover)] text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition cursor-pointer"
                      title="Assign Employees"
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    {handleDeleteStructure && (
                      <button
                        onClick={() => handleDeleteStructure(structId)}
                        className="p-2 rounded-xl hover:bg-[var(--color-card-hover)] text-[var(--color-foreground-muted)] hover:text-red-500 transition cursor-pointer"
                        title="Delete Structure"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[var(--color-border)]/60 text-xs">
                  <div className="p-2.5 rounded-xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]/30">
                    <span className="text-[10px] text-[var(--color-foreground-muted)] block font-semibold uppercase tracking-wider mb-0.5">
                      BASIC PAY
                    </span>
                    <span className="font-bold text-[var(--color-foreground)]">
                      {struct.basicPercentage ?? 0}% of Gross
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]/30">
                    <span className="text-[10px] text-[var(--color-foreground-muted)] block font-semibold uppercase tracking-wider mb-0.5">
                      HRA
                    </span>
                    <span className="font-bold text-[var(--color-foreground)]">
                      {struct.hraPercentage ?? 0}% of Basic
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]/30">
                    <span className="text-[10px] text-[var(--color-foreground-muted)] block font-semibold uppercase tracking-wider mb-0.5">
                      SPECIAL ALLOWANCE
                    </span>
                    <span className="font-bold text-[var(--color-foreground)]">
                      ₹{allowances.specialAllowance ?? struct.specialAllowance ?? 0}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]/30">
                    <span className="text-[10px] text-[var(--color-foreground-muted)] block font-semibold uppercase tracking-wider mb-0.5">
                      BONUS CONFIG
                    </span>
                    <span className="font-bold text-[var(--color-foreground)] truncate block">
                      {bonus.type || struct.bonusType || "Fixed"} (₹{bonus.value ?? struct.bonusValue ?? 0})
                    </span>
                  </div>
                </div>

                {/* Footer with Dynamic Counts */}
                <div className="flex justify-between items-center pt-2 text-[11px] font-semibold text-[var(--color-foreground-muted)] border-t border-[var(--color-border)]/40">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    Assigned:{" "}
                    <strong className="text-[var(--color-primary)] font-bold text-xs bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">
                      {dynamicAssignedCount} {dynamicAssignedCount === 1 ? "Employee" : "Employees"}
                    </strong>
                  </span>
                  <button
                    onClick={() => openAssignModal(struct)}
                    className="text-[var(--color-primary)] hover:underline font-bold transition cursor-pointer"
                  >
                    Manage Assignment →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative z-[10000] bg-[var(--color-background-elevated)] border border-[var(--color-border)] w-full max-w-2xl rounded-2xl shadow-2xl p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                {selectedStructure ? "Edit Salary Structure" : "Create New Salary Structure"}
              </h3>
              <button
                type="button"
                onClick={closeModals}
                className="p-1.5 rounded-xl hover:bg-[var(--color-muted)] transition cursor-pointer"
              >
                <X className="w-5 h-5 text-[var(--color-foreground)]" />
              </button>
            </div>

            <form onSubmit={handleSaveStructure} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1.5 text-[var(--color-foreground)]">Structure Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                    placeholder="e.g. Executive Senior"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1.5 text-[var(--color-foreground)]">Structure Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ""}
                    onChange={(e) => handleInputChange("code", e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] uppercase focus:outline-none focus:border-[var(--color-primary)] font-medium"
                    placeholder="e.g. EXEC_SR"
                  />
                </div>
              </div>

              {/* Basic Pay & HRA */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[var(--color-muted)]/20 border border-[var(--color-border)]/60">
                <div>
                  <label className="font-semibold block mb-1 text-[var(--color-foreground)]">
                    Basic Pay (% of Gross)
                  </label>
                  <input
                    type="number"
                    value={formData.basicPercentage ?? ""}
                    onChange={(e) => handleNumberInputChange("basicPercentage", e.target.value)}
                    placeholder="0"
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-[var(--color-foreground)]">
                    HRA (% of Basic)
                  </label>
                  <input
                    type="number"
                    value={formData.hraPercentage ?? ""}
                    onChange={(e) => handleNumberInputChange("hraPercentage", e.target.value)}
                    placeholder="0"
                    className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                  />
                </div>
              </div>

              {/* Allowances */}
              <div className="space-y-2">
                <span className="font-bold text-[var(--color-foreground-muted)] uppercase text-[10px] tracking-wider">
                  Allowances Breakdown (Fixed ₹)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block mb-1 font-medium text-[var(--color-foreground)]">Special</label>
                    <input
                      type="number"
                      value={formData.specialAllowance ?? ""}
                      onChange={(e) => handleNumberInputChange("specialAllowance", e.target.value)}
                      placeholder="0"
                      className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-[var(--color-foreground)]">Medical</label>
                    <input
                      type="number"
                      value={formData.medicalAllowance ?? ""}
                      onChange={(e) => handleNumberInputChange("medicalAllowance", e.target.value)}
                      placeholder="0"
                      className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-[var(--color-foreground)]">Conveyance</label>
                    <input
                      type="number"
                      value={formData.conveyanceAllowance ?? ""}
                      onChange={(e) => handleNumberInputChange("conveyanceAllowance", e.target.value)}
                      placeholder="0"
                      className="w-full p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Bonus Dropdowns */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="font-semibold block mb-1 text-[var(--color-foreground)]">Bonus Type</label>
                  <CustomDropdown
                    value={formData.bonusType}
                    onChange={(val) => handleInputChange("bonusType", val)}
                    options={["Performance", "Annual Fixed", "Festival Bonus"]}
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-[var(--color-foreground)]">Bonus Value (₹)</label>
                  <input
                    type="number"
                    value={formData.bonusValue ?? ""}
                    onChange={(e) => handleNumberInputChange("bonusValue", e.target.value)}
                    placeholder="0"
                    className="w-full p-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] focus:outline-none focus:border-[var(--color-primary)] font-medium"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1 text-[var(--color-foreground)]">Frequency</label>
                  <CustomDropdown
                    value={formData.bonusFrequency}
                    onChange={(val) => handleInputChange("bonusFrequency", val)}
                    options={["Monthly", "Quarterly", "Yearly"]}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={closeModals}
                  className="px-4 py-2.5 rounded-xl bg-[var(--color-muted)] hover:bg-[var(--color-card-hover)] font-semibold transition cursor-pointer text-[var(--color-foreground)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[var(--color-primary)] text-white font-bold hover:opacity-90 transition cursor-pointer shadow-md shadow-[var(--color-primary)]/20"
                >
                  Save Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGNMENT MODAL */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative z-[10000] bg-[var(--color-background-elevated)] border border-[var(--color-border)] w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-primary)]">
                  Assign Structure
                </h3>
                <p className="text-xs text-[var(--color-foreground-muted)] font-medium mt-0.5">
                  Target Tier: <strong className="text-[var(--color-foreground)]">{selectedStructure?.name}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={closeModals}
                className="p-1.5 rounded-xl hover:bg-[var(--color-muted)] transition cursor-pointer"
              >
                <X className="w-5 h-5 text-[var(--color-foreground)]" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 text-xs pr-1">
              {employees.length === 0 ? (
                <p className="p-4 text-center text-[var(--color-foreground-muted)]">No employees available.</p>
              ) : (
                employees.map((emp) => {
                  const empId = emp.id || emp._id;
                  const isChecked = selectedEmpIds.includes(empId);

                  return (
                    <div
                      key={empId}
                      onClick={() => toggleEmployeeSelection(empId)}
                      className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                          : "border-[var(--color-border)] hover:bg-[var(--color-card-hover)]"
                      }`}
                    >
                      <div>
                        <div className="font-bold text-[var(--color-foreground)]">{emp.name}</div>
                        <div className="text-[10px] text-[var(--color-foreground-muted)] font-semibold mt-0.5">
                          {emp.dept || emp.department || "General"}
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                          isChecked
                            ? "bg-[var(--color-primary)] border-[var(--color-primary)] text-white"
                            : "border-[var(--color-border)] bg-[var(--color-background)]"
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
              <button
                type="button"
                onClick={closeModals}
                className="px-4 py-2 rounded-xl bg-[var(--color-muted)] text-xs font-semibold transition cursor-pointer text-[var(--color-foreground)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAssignment}
                className="px-4 py-2 rounded-xl bg-[var(--color-primary)] text-white text-xs font-bold hover:opacity-90 transition cursor-pointer shadow-md shadow-[var(--color-primary)]/20"
              >
                Confirm Assignment ({selectedEmpIds.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
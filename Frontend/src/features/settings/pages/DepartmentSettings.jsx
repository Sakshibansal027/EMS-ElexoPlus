import { useState } from "react";
import SettingsSection from "../components/SettingsSection";
import EmptyState from "../components/EmptyState";
import { initialDepartments } from "../mock/settingsMock";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const DepartmentSettings = () => {
  const [departments, setDepartments] = useState(initialDepartments);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", head: "", status: "Active" });

  const resetForm = () => {
    setFormData({ name: "", head: "", status: "Active" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    const newDept = {
      id: Date.now(),
      name: formData.name.trim(),
      head: formData.head.trim() || null,
      status: formData.status,
    };
    setDepartments((prev) => [...prev, newDept]);
    resetForm();
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({ name: dept.name, head: dept.head || "", status: dept.status });
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!formData.name.trim()) return;
    setDepartments((prev) =>
      prev.map((d) =>
        d.id === editingId
          ? { ...d, name: formData.name.trim(), head: formData.head.trim() || null, status: formData.status }
          : d,
      ),
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setDepartments((prev) => prev.filter((d) => d.id !== id));
    if (editingId === id) resetForm();
  };

  const activeDepartments = departments.filter((d) => d.status === "Active");
  const inactiveDepartments = departments.filter((d) => d.status === "Inactive");

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Departments"
        description="Manage all organizational departments."
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            {departments.length} department{departments.length !== 1 ? "s" : ""} configured
          </p>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            <Plus size={16} />
            Add Department
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Department Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Engineering"
                  className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Department Head
                </label>
                <input
                  type="text"
                  value={formData.head}
                  onChange={(e) => setFormData((p) => ({ ...p, head: e.target.value }))}
                  placeholder="e.g. John Doe"
                  className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <CustomSelect
                  label="Status"
                  placeholder="Select status"
                  options={["Active", "Inactive"]}
                  value={formData.status}
                  onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))}
                  width="w-full"
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                onClick={editingId ? handleUpdate : handleAdd}
                className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
              >
                <Check size={16} />
                {editingId ? "Update" : "Add"}
              </button>
              <button
                onClick={resetForm}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground-muted transition-all duration-300 hover:border-danger hover:text-danger"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {departments.length === 0 ? (
          <EmptyState message="No departments configured yet." />
        ) : (
          <div>
            {activeDepartments.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-success">
                  Active ({activeDepartments.length})
                </h3>
                <div className="space-y-2">
                  {activeDepartments.map((dept) => (
                    <DepartmentRow
                      key={dept.id}
                      department={dept}
                      onEdit={() => handleEdit(dept)}
                      onDelete={() => handleDelete(dept.id)}
                    />
                  ))}
                </div>
              </div>
            )}
            {inactiveDepartments.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Inactive ({inactiveDepartments.length})
                </h3>
                <div className="space-y-2">
                  {inactiveDepartments.map((dept) => (
                    <DepartmentRow
                      key={dept.id}
                      department={dept}
                      onEdit={() => handleEdit(dept)}
                      onDelete={() => handleDelete(dept.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </SettingsSection>
    </div>
  );
};

const DepartmentRow = ({ department, onEdit, onDelete }) => {
  return (
    <div className="card flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 hover:border-primary/30">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <span className="text-sm font-bold">
            {department.name.charAt(0)}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {department.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {department.head ? `Head: ${department.head}` : "No head assigned"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onEdit}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300 hover:bg-primary hover:text-black"
          aria-label="Edit department"
        >
          <Pencil size={15} />
        </button>
        <button
          onClick={onDelete}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
          aria-label="Delete department"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
};

export default DepartmentSettings;

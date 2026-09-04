import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import SettingsSection from "../components/SettingsSection";
import EmptyState from "../components/EmptyState";
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from "../services/settingsService";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";

const DepartmentSettings = () => {
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", head: "", status: "Active" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDepartments(); }, []);

  const resetForm = () => {
    setFormData({ name: "", head: "", status: "Active" });
    setShowForm(false);
    setEditingId(null);
    setError(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const result = await createDepartment(formData);
      if (result.success) {
        setDepartments((prev) => [...prev, result.department]);
        resetForm();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create department.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (dept) => {
    setEditingId(dept.id);
    setFormData({ name: dept.name, head: dept.head || "", status: dept.status });
    setShowForm(true);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const result = await updateDepartment(editingId, formData);
      if (result.success) {
        setDepartments((prev) => prev.map((d) => d.id === editingId ? result.department : d));
        resetForm();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update department.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteDepartment(id);
      if (result.success) {
        setDepartments((prev) => prev.filter((d) => d.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete department.");
    }
  };

  const activeDepartments = departments.filter((d) => d.status === "Active");
  const inactiveDepartments = departments.filter((d) => d.status === "Inactive");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <SettingsSection title="Departments" description="Manage all organizational departments.">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            {departments.length} department{departments.length !== 1 ? "s" : ""} configured
          </p>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105">
            <Plus size={16} /> Add Department
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">Department Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Engineering" className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">Department Head</label>
                <input type="text" value={formData.head} onChange={(e) => setFormData((p) => ({ ...p, head: e.target.value }))}
                  placeholder="e.g. John Doe" className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <CustomSelect label="Status" placeholder="Select status" options={["Active", "Inactive"]}
                  value={formData.status} onValueChange={(val) => setFormData((p) => ({ ...p, status: val }))} width="w-full" />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button onClick={editingId ? handleUpdate : handleAdd} disabled={saving}
                className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50">
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editingId ? "Update" : "Add"}
              </button>
              <button onClick={resetForm}
                className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-secondary px-5 py-2.5 text-sm font-semibold text-foreground-muted transition-all duration-300 hover:border-danger hover:text-danger">
                <X size={16} /> Cancel
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
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-success">Active ({activeDepartments.length})</h3>
                <div className="space-y-2">
                  {activeDepartments.map((dept) => (
                    <DepartmentRow key={dept.id} department={dept} onEdit={() => handleEdit(dept)} onDelete={() => handleDelete(dept.id)} />
                  ))}
                </div>
              </div>
            )}
            {inactiveDepartments.length > 0 && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Inactive ({inactiveDepartments.length})</h3>
                <div className="space-y-2">
                  {inactiveDepartments.map((dept) => (
                    <DepartmentRow key={dept.id} department={dept} onEdit={() => handleEdit(dept)} onDelete={() => handleDelete(dept.id)} />
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

const DepartmentRow = ({ department, onEdit, onDelete }) => (
  <div className="card flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 hover:border-primary/30">
    <div className="flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <span className="text-sm font-bold">{department.name.charAt(0)}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{department.name}</p>
        <p className="text-xs text-muted-foreground">{department.head ? `Head: ${department.head}` : "No head assigned"}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={onEdit} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300 hover:bg-primary hover:text-black" aria-label="Edit department">
        <Pencil size={15} />
      </button>
      <button onClick={onDelete} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white" aria-label="Delete department">
        <Trash2 size={15} />
      </button>
    </div>
  </div>
);

export default DepartmentSettings;

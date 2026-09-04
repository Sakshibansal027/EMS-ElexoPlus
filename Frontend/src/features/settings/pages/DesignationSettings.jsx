import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import SettingsSection from "../components/SettingsSection";
import EmptyState from "../components/EmptyState";
import { getDesignations, createDesignation, updateDesignation, deleteDesignation, getDepartments } from "../services/settingsService";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";

const DesignationSettings = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", department: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [desigData, deptData] = await Promise.all([getDesignations(), getDepartments()]);
      setDesignations(desigData);
      setDepartments(deptData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setFormData({ name: "", department: "" });
    setShowForm(false);
    setEditingId(null);
    setError(null);
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const result = await createDesignation(formData);
      if (result.success) {
        setDesignations((prev) => [...prev, result.designation]);
        resetForm();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create designation.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, department: item.department || "" });
    setShowForm(true);
    setError(null);
  };

  const handleUpdate = async () => {
    if (!formData.name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const result = await updateDesignation(editingId, formData);
      if (result.success) {
        setDesignations((prev) => prev.map((d) => d.id === editingId ? result.designation : d));
        resetForm();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update designation.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteDesignation(id);
      if (result.success) {
        setDesignations((prev) => prev.filter((d) => d.id !== id));
        if (editingId === id) resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete designation.");
    }
  };

  const activeDepartments = departments.filter((d) => d.status === "Active");

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
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
      )}

      <SettingsSection title="Designations" description="Manage job titles and roles across departments.">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            {designations.length} designation{designations.length !== 1 ? "s" : ""} configured
          </p>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105">
            <Plus size={16} /> Add Designation
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">Designation Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Senior Engineer" className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div>
                <CustomSelect label="Department" placeholder="Select Department"
                  options={activeDepartments.map((d) => ({ label: d.name, value: d.name }))}
                  value={formData.department}
                  onValueChange={(val) => setFormData((p) => ({ ...p, department: val }))} width="w-full" />
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

        {designations.length === 0 ? (
          <EmptyState message="No designations configured yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Designation</th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Department</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {designations.map((item) => (
                  <tr key={item.id} className="transition-colors duration-200 hover:bg-card">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">{item.name.charAt(0)}</div>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-primary">{item.department}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300 hover:bg-primary hover:text-black" aria-label="Edit designation">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white" aria-label="Delete designation">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SettingsSection>
    </div>
  );
};

export default DesignationSettings;

import { useState } from "react";
import SettingsSection from "../components/SettingsSection";
import EmptyState from "../components/EmptyState";
import { initialEmployeeStatuses } from "../mock/settingsMock";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";

const STATUS_COLORS = [
  { label: "Green", value: "#2ecc71" },
  { label: "Red", value: "#e74c3c" },
  { label: "Yellow", value: "#ffbf00" },
  { label: "Orange", value: "#e67e22" },
  { label: "Blue", value: "#3498db" },
  { label: "Purple", value: "#9b59b6" },
  { label: "Gray", value: "#95a5a6" },
];

const EmployeeStatusSettings = () => {
  const [statuses, setStatuses] = useState(initialEmployeeStatuses);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", color: "#2ecc71" });

  const resetForm = () => {
    setFormData({ name: "", color: "#2ecc71" });
    setShowForm(false);
    setEditingId(null);
  };

  const handleAdd = () => {
    if (!formData.name.trim()) return;
    setStatuses((prev) => [
      ...prev,
      { id: Date.now(), name: formData.name.trim(), color: formData.color },
    ]);
    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({ name: item.name, color: item.color });
    setShowForm(true);
  };

  const handleUpdate = () => {
    if (!formData.name.trim()) return;
    setStatuses((prev) =>
      prev.map((s) =>
        s.id === editingId
          ? { ...s, name: formData.name.trim(), color: formData.color }
          : s,
      ),
    );
    resetForm();
  };

  const handleDelete = (id) => {
    setStatuses((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Employee Statuses"
        description="Define the status labels used for employees."
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-foreground-muted">
            {statuses.length} status{statuses.length !== 1 ? "es" : ""} configured
          </p>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-300 hover:scale-105"
          >
            <Plus size={16} />
            Add Status
          </button>
        </div>

        {showForm && (
          <div className="mb-6 rounded-2xl border border-primary/20 bg-card p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Status Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Active"
                  className="input w-full rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-foreground-muted uppercase tracking-wider">
                  Color
                </label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                    className="h-11 w-14 cursor-pointer rounded-xl border border-border bg-card"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {STATUS_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, color: c.value }))}
                        className={`h-7 w-7 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                          formData.color === c.value
                            ? "border-white scale-110"
                            : "border-transparent"
                        }`}
                        style={{ background: c.value }}
                        aria-label={c.label}
                      />
                    ))}
                  </div>
                </div>
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

        {statuses.length === 0 ? (
          <EmptyState message="No statuses configured yet." />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Color
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {statuses.map((item) => (
                  <tr
                    key={item.id}
                    className="transition-colors duration-200 hover:bg-card"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ background: item.color }}
                        />
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <code className="rounded-lg bg-muted px-3 py-1 text-xs font-mono text-muted-foreground">
                        {item.color}
                      </code>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-primary transition-all duration-300 hover:bg-primary hover:text-black"
                          aria-label="Edit status"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-secondary text-red-400 transition-all duration-300 hover:bg-red-500 hover:text-white"
                          aria-label="Delete status"
                        >
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

export default EmployeeStatusSettings;

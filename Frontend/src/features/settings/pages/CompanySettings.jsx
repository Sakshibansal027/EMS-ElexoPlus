import { useState, useEffect } from "react";
import { ShieldBan, Save, Loader2 } from "lucide-react";
import SettingsSection from "../components/SettingsSection";
import { getCompanySettings, updateCompanySettings } from "../services/settingsService";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";
import useAuth from "../../auth/hooks/useAuth";
import ROLES from "../../../config/roles";

const DAY_OPTIONS = [
  "Monday", "Tuesday", "Wednesday", "Thursday",
  "Friday", "Saturday", "Sunday",
];

const CompanySettings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    companyName: "", tagline: "", email: "", phone: "", website: "",
    address: "", city: "", state: "", country: "", pincode: "",
    workingDays: [], workingHoursStart: "09:00", workingHoursEnd: "18:00",
    timezone: "Asia/Kolkata", dateFormat: "DD-MMM-YYYY", currency: "INR",
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getCompanySettings();
        setForm(settings);
      } catch (err) {
        console.error("Failed to load company settings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (user?.role !== ROLES.ADMIN) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
          <ShieldBan size={40} className="text-muted-foreground" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-foreground">Access Restricted</h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Only administrators can modify company settings.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
    setError(null);
  };

  const toggleDay = (day) => {
    setForm((prev) => {
      const exists = prev.workingDays.includes(day);
      return {
        ...prev,
        workingDays: exists
          ? prev.workingDays.filter((d) => d !== day)
          : [...prev.workingDays, day],
      };
    });
    setSaved(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateCompanySettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <SettingsSection title="Organization Information" description="Basic details about your company.">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Company Name</label>
            <input type="text" value={form.companyName} onChange={handleChange("companyName")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Tagline</label>
            <input type="text" value={form.tagline} onChange={handleChange("tagline")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Email</label>
            <input type="email" value={form.email} onChange={handleChange("email")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Phone</label>
            <input type="text" value={form.phone} onChange={handleChange("phone")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Website</label>
            <input type="text" value={form.website} onChange={handleChange("website")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <CustomSelect label="Timezone" placeholder="Select timezone"
              options={[
                { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
                { label: "Asia/Dubai", value: "Asia/Dubai" },
                { label: "America/New_York", value: "America/New_York" },
                { label: "Europe/London", value: "Europe/London" },
              ]}
              value={form.timezone}
              onValueChange={(val) => { setForm((p) => ({ ...p, timezone: val })); setSaved(false); setError(null); }}
              width="w-full" />
          </div>
          <div>
            <CustomSelect label="Date Format" placeholder="Select date format"
              options={[
                { label: "DD-MMM-YYYY (e.g., 09-Jul-2026)", value: "DD-MMM-YYYY" },
                { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
                { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
                { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
              ]}
              value={form.dateFormat}
              onValueChange={(val) => { setForm((p) => ({ ...p, dateFormat: val })); setSaved(false); setError(null); }}
              width="w-full" />
          </div>
          <div>
            <CustomSelect label="Currency" placeholder="Select currency"
              options={[
                { label: "INR (₹)", value: "INR" },
                { label: "USD ($)", value: "USD" },
                { label: "EUR (€)", value: "EUR" },
                { label: "GBP (£)", value: "GBP" },
              ]}
              value={form.currency}
              onValueChange={(val) => { setForm((p) => ({ ...p, currency: val })); setSaved(false); setError(null); }}
              width="w-full" />
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Address</label>
          <textarea value={form.address} onChange={handleChange("address")} rows={3}
            className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary resize-none" />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">City</label>
            <input type="text" value={form.city} onChange={handleChange("city")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">State</label>
            <input type="text" value={form.state} onChange={handleChange("state")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Pincode</label>
            <input type="text" value={form.pincode} onChange={handleChange("pincode")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
        </div>
      </SettingsSection>

      <SettingsSection title="Working Days & Hours" description="Configure the standard work week.">
        <div className="flex flex-wrap gap-3">
          {DAY_OPTIONS.map((day) => {
            const selected = form.workingDays.includes(day);
            return (
              <button key={day} type="button" onClick={() => toggleDay(day)}
                className={`rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer ${
                  selected
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-primary)]"
                    : "border border-border bg-card text-foreground-muted hover:border-primary hover:text-primary"
                }`}>
                {day}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Work Start Time</label>
            <input type="time" value={form.workingHoursStart} onChange={handleChange("workingHoursStart")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground-muted">Work End Time</label>
            <input type="time" value={form.workingHoursEnd} onChange={handleChange("workingHoursEnd")}
              className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary" />
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default CompanySettings;

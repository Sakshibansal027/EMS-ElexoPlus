import { useState } from "react";
import { Sun, Moon, Save } from "lucide-react";
import useTheme from "../../../contexts/useTheme";
import SettingsSection from "../components/SettingsSection";
import Toggle from "../components/Toggle";
import CustomSelect from "../../employee-master/components/ui/CustomSelect";
import { initialPreferences } from "../mock/settingsMock";

const FONT_SIZES = [
  { label: "Small", value: "small" },
  { label: "Medium", value: "medium" },
  { label: "Large", value: "large" },
];

const LANGUAGES = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
];

const TIME_FORMATS = [
  { label: "12-hour (12:00 PM)", value: "12h" },
  { label: "24-hour (14:00)", value: "24h" },
];

const WEEK_DAYS = [
  { label: "Monday", value: "monday" },
  { label: "Sunday", value: "sunday" },
];

const DIGEST_OPTIONS = [
  { label: "Immediate", value: "immediate" },
  { label: "Daily Digest", value: "daily" },
  { label: "Weekly Digest", value: "weekly" },
];

const AppPreferences = () => {
  const {
    theme,
    fontSize,
    reducedMotion,
    compactMode,
    updateTheme,
    updateFontSize,
    updateReducedMotion,
    updateCompactMode,
  } = useTheme();

  const [notifications, setNotifications] = useState(initialPreferences.notifications);
  const [language, setLanguage] = useState(initialPreferences.language);
  const [saved, setSaved] = useState(false);

  const updateNotification = (channel, field, value) => {
    setNotifications((prev) => ({
      ...prev,
      [channel]: { ...prev[channel], [field]: value },
    }));
    setSaved(false);
  };

  const updateNotificationField = (field, value) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const updateLanguage = (field, value) => {
    setLanguage((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SettingsSection
        title="Appearance"
        description="Customize how the application looks and feels."
      >
        {/* Theme Toggle */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-foreground-muted uppercase tracking-wider">
            Theme
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => updateTheme("dark")}
              className={`flex items-center gap-3 rounded-2xl border px-6 py-4 text-sm font-medium transition-all duration-300 cursor-pointer flex-1 ${
                theme === "dark"
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-primary)]"
                  : "border-border bg-card text-foreground-muted hover:border-primary hover:text-primary"
              }`}
            >
              <Moon size={20} />
              Dark Mode
            </button>
            <button
              onClick={() => updateTheme("light")}
              className={`flex items-center gap-3 rounded-2xl border px-6 py-4 text-sm font-medium transition-all duration-300 cursor-pointer flex-1 ${
                theme === "light"
                  ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-primary)]"
                  : "border-border bg-card text-foreground-muted hover:border-primary hover:text-primary"
              }`}
            >
              <Sun size={20} />
              Light Mode
            </button>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <CustomSelect
              label="Font Size"
              placeholder="Select font size"
              options={FONT_SIZES}
              value={fontSize}
              onValueChange={(val) => updateFontSize(val)}
              width="w-full"
            />
          </div>
          <Toggle
            enabled={compactMode}
            onChange={() => updateCompactMode(!compactMode)}
            label="Compact Mode"
            description="Reduce spacing for a denser layout"
          />
          <Toggle
            enabled={reducedMotion}
            onChange={() => updateReducedMotion(!reducedMotion)}
            label="Reduced Motion"
            description="Minimize animations and transitions"
          />
        </div>
      </SettingsSection>

      <SettingsSection
        title="Notifications"
        description="Control which notifications you receive and how."
      >
        {/* Email Notifications */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-foreground-muted uppercase tracking-wider">
            Email Notifications
          </p>
          <div className="space-y-4">
            <Toggle
              enabled={notifications.email.leaveUpdates}
              onChange={() => updateNotification("email", "leaveUpdates", !notifications.email.leaveUpdates)}
              label="Leave Updates"
              description="When leave requests are approved, rejected or created"
            />
            <Toggle
              enabled={notifications.email.attendanceAlerts}
              onChange={() => updateNotification("email", "attendanceAlerts", !notifications.email.attendanceAlerts)}
              label="Attendance Alerts"
              description="Missed check-ins or irregular attendance patterns"
            />
            <Toggle
              enabled={notifications.email.payrollUpdates}
              onChange={() => updateNotification("email", "payrollUpdates", !notifications.email.payrollUpdates)}
              label="Payroll Updates"
              description="Salary slips, reimbursements and tax updates"
            />
            <Toggle
              enabled={notifications.email.taskAssignments}
              onChange={() => updateNotification("email", "taskAssignments", !notifications.email.taskAssignments)}
              label="Task Assignments"
              description="New tasks, deadlines and status changes"
            />
            <Toggle
              enabled={notifications.email.systemAnnouncements}
              onChange={() => updateNotification("email", "systemAnnouncements", !notifications.email.systemAnnouncements)}
              label="System Announcements"
              description="Maintenance, updates and policy changes"
            />
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-foreground-muted uppercase tracking-wider">
            In-App Notifications
          </p>
          <div className="space-y-4">
            <Toggle
              enabled={notifications.inApp.leaveUpdates}
              onChange={() => updateNotification("inApp", "leaveUpdates", !notifications.inApp.leaveUpdates)}
              label="Leave Updates"
            />
            <Toggle
              enabled={notifications.inApp.attendanceAlerts}
              onChange={() => updateNotification("inApp", "attendanceAlerts", !notifications.inApp.attendanceAlerts)}
              label="Attendance Alerts"
            />
            <Toggle
              enabled={notifications.inApp.payrollUpdates}
              onChange={() => updateNotification("inApp", "payrollUpdates", !notifications.inApp.payrollUpdates)}
              label="Payroll Updates"
            />
            <Toggle
              enabled={notifications.inApp.taskAssignments}
              onChange={() => updateNotification("inApp", "taskAssignments", !notifications.inApp.taskAssignments)}
              label="Task Assignments"
            />
            <Toggle
              enabled={notifications.inApp.systemAnnouncements}
              onChange={() => updateNotification("inApp", "systemAnnouncements", !notifications.inApp.systemAnnouncements)}
              label="System Announcements"
            />
          </div>
        </div>

        {/* General Notification Settings */}
        <div>
          <p className="mb-3 text-sm font-medium text-foreground-muted uppercase tracking-wider">
            General
          </p>
          <div className="space-y-5">
            <Toggle
              enabled={notifications.pushEnabled}
              onChange={() => updateNotificationField("pushEnabled", !notifications.pushEnabled)}
              label="Push Notifications"
              description="Receive browser push notifications when away"
            />
            <div>
              <CustomSelect
                label="Digest Frequency"
                placeholder="Select frequency"
                options={DIGEST_OPTIONS}
                value={notifications.digestFrequency}
                onValueChange={(val) => updateNotificationField("digestFrequency", val)}
                width="w-full"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground-muted">
                  Quiet Hours Start
                </label>
                <input
                  type="time"
                  value={notifications.quietHoursStart}
                  onChange={(e) => updateNotificationField("quietHoursStart", e.target.value)}
                  className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground-muted">
                  Quiet Hours End
                </label>
                <input
                  type="time"
                  value={notifications.quietHoursEnd}
                  onChange={(e) => updateNotificationField("quietHoursEnd", e.target.value)}
                  className="input w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-300 focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingsSection>

      <SettingsSection
        title="Language & Regional"
        description="Set your language and regional formatting preferences."
      >
        <div className="space-y-5">
          <div>
            <CustomSelect
              label="Language"
              placeholder="Select language"
              options={LANGUAGES}
              value={language.preferred}
              onValueChange={(val) => updateLanguage("preferred", val)}
              width="w-full"
            />
          </div>
          <div>
            <CustomSelect
              label="Time Format"
              placeholder="Select time format"
              options={TIME_FORMATS}
              value={language.timeFormat}
              onValueChange={(val) => updateLanguage("timeFormat", val)}
              width="w-full"
            />
          </div>
          <div>
            <CustomSelect
              label="First Day of Week"
              placeholder="Select first day"
              options={WEEK_DAYS}
              value={language.firstDayOfWeek}
              onValueChange={(val) => updateLanguage("firstDayOfWeek", val)}
              width="w-full"
            />
          </div>
        </div>
      </SettingsSection>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="btn-primary flex cursor-pointer items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
        >
          <Save size={18} />
          {saved ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
};

export default AppPreferences;

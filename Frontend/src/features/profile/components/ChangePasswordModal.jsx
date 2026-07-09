import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  X,
  CheckCircle2,
  Circle,
} from "lucide-react";
import useAuth from "../../auth/hooks/useAuth";
import { ROUTES } from "../../../routes/routes";

const PASSWORD_RULES = [
  {
    label: "Minimum 8 characters",
    validate: (value) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    validate: (value) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    validate: (value) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    validate: (value) => /\d/.test(value),
  },
  {
    label: "One special character",
    validate: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
  },
];

const ChangePasswordModal = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    current: "",
    password: "",
    confirm: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    password: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {

    if (error) setError("");

    setForm((prev) => ({

      ...prev,

      [field]: value,

    }));

  };

  const togglePassword = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const passwordChecks = PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.validate(form.password),
  }));

  const passedRules = passwordChecks.filter((item) => item.passed).length;

  const strength = useMemo(() => {
    if (!form.password)
      return {
        label: "",
        width: "0%",
        color: "bg-border",
      };

    if (passedRules <= 2)
      return {
        label: "Weak",
        width: "35%",
        color: "bg-danger",
      };

    if (passedRules <= 4)
      return {
        label: "Medium",
        width: "70%",
        color: "bg-warning",
      };

    return {
      label: "Strong",
      width: "100%",
      color: "bg-success",
    };
  }, [form.password, passedRules]);

  const passwordsMatch =
    form.confirm.length > 0 && form.password === form.confirm;

  const isFormValid =
    form.current &&
    form.password &&
    passwordsMatch &&
    passedRules === PASSWORD_RULES.length;

  useEffect(() => {
    if (!open) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () =>
      document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setForm({
        current: "",
        password: "",
        confirm: "",
      });

      setShowPassword({
        current: false,
        password: false,
        confirm: false,
      });

      setLoading(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <LockKeyhole size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">Change Password</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/5 rounded-lg text-foreground-muted transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="password-scroll p-5 overflow-y-auto space-y-5">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Current Password</label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                value={form.current}
                onChange={(e) => handleChange("current", e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-background-secondary border border-border rounded-xl p-3 text-sm outline-none focus:border-primary transition-all"
              />
              <button type="button" onClick={() => togglePassword("current")} className="absolute right-3 top-3 text-foreground-muted hover:text-primary">
                {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {error && <p className="text-xs text-danger">{error}</p>}
          </div>

          <div className="flex justify-end mt-2">

            <button

              type="button"

              onClick={() => {

                onClose();

                navigate(ROUTES.FORGOT_PASSWORD);

              }}

              className="text-xs text-primary hover:underline"

            >

              Forgot Password?

            </button>

          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">New Password</label>
            <div className="relative">

              <input
                type={showPassword.password ? "text" : "password"}
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-background-secondary border border-border rounded-xl p-3 pr-12 text-sm outline-none focus:border-primary transition-all"
              />

              <button
                type="button"
                onClick={() => togglePassword("password")}
                className="absolute right-3 top-3 text-foreground-muted hover:text-primary"
              >

                {showPassword.password
                  ? <EyeOff size={16} />
                  : <Eye size={16} />}

              </button>

            </div>
            {/* Strength Meter */}
            <div className="h-1.5 w-full bg-border rounded-full mt-2 overflow-hidden">
              <div className={`h-full transition-all duration-500 ${strength.color}`} style={{ width: strength.width }} />
            </div>
          </div>

          {/* Requirements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-background-secondary/50 rounded-xl border border-border">
            {passwordChecks.map((rule) => (
              <div key={rule.label} className="flex items-center gap-2 text-[11px]">
                {rule.passed ? <CheckCircle2 size={13} className="text-success" /> : <Circle size={13} className="text-foreground-muted" />}
                <span className={rule.passed ? "text-success" : "text-foreground-muted"}>{rule.label}</span>
              </div>
            ))}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Confirm Password</label>
            <div className="relative">

              <input
                type={showPassword.confirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => handleChange("confirm", e.target.value)}
                placeholder="Confirm new password"
                className="w-full bg-background-secondary border border-border rounded-xl p-3 pr-12 text-sm outline-none focus:border-primary transition-all"
              />

              <button
                type="button"
                onClick={() => togglePassword("confirm")}
                className="absolute right-3 top-3 text-foreground-muted hover:text-primary"
              >

                {showPassword.confirm
                  ? <EyeOff size={16} />
                  : <Eye size={16} />}

              </button>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-end gap-3 bg-card shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-white/5 rounded-xl transition">Cancel</button>
          <button
            disabled={!isFormValid || loading}
            onClick={() => {
              if (form.current !== user.password) {
                setError("Current password is incorrect.");
                return;
              }
              setError("");
              setLoading(true);
              setTimeout(() => {

                alert("Password Updated Successfully");

                setLoading(false);

                onClose();

              }, 1200);
            }}
            className="
btn-primary
flex
items-center
justify-center
gap-2
px-6
py-3
font-semibold
shadow-[var(--shadow-primary)]
hover:scale-[1.02]
active:scale-95
disabled:opacity-50
disabled:pointer-events-none
"
          >
            {loading ? "Updating..." : <><KeyRound size={16} /> Update Password</>}
          </button>
        </div>
      </div>
    </div>
  );

};

export default ChangePasswordModal;
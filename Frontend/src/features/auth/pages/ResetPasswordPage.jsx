import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  FileText,
  Wallet,
  Sparkles,
} from "lucide-react";
import authService from "../services/authService";
import { ROUTES } from "../../../routes/routes";

const FEATURE_CARDS = [
  { icon: FileText, label: "Employee Master", value: "Complete profiles" },
  { icon: FileText, label: "Payroll", value: "Automated processing" },
  { icon: Wallet, label: "Payslips", value: "PDF generation" },
  { icon: ShieldCheck, label: "Compliance", value: "PF/ESI/PT/TDS" },
];

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    if (!password.trim()) {
      setError("Password is required.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (!confirm.trim()) {
      setError("Please confirm your password.");
      return false;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }

    if (!validate()) return;

    setLoading(true);

    const response = await authService.resetPassword({
      token,
      password,
    });

    setLoading(false);

    if (!response.success) {
      setError(response.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate(ROUTES.LOGIN), 2500);
  };

  if (!token) {
    return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
        <div
          className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
          style={{ background: "var(--gradient-glow)" }}
        >
          <div className="relative m-0">
            <div className="max-h-30 size-60">
              <img src="/logo.png" alt="ElexoPlus Logo" />
            </div>
          </div>
          <div className="relative max-w-md">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-amber-300" />
              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-200">
                Employee Management System
              </span>
            </div>
            <h1 className="font-display text-5xl font-black leading-[1.05] mb-4">
              Manage your
              <br />
              <span className="text-amber-400">entire workforce</span>
              <br />
              in one place.
            </h1>
          </div>
          <div className="relative text-xs text-white/60 mt-6 text-left">
            &copy; {new Date().getFullYear()} ElexoPlus Pvt.Ltd &middot; All
            Rights Reserved
          </div>
        </div>

        <div className="flex items-center justify-center flex-col gap-4 p-6 md:p-12 relative">
          <div className="mb-8 w-3/4">
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors no-underline mb-6"
            >
              <ArrowLeft size={14} /> Back to reset password
            </Link>
            <h2 className="font-display text-3xl font-black tracking-tight mb-2">
              Invalid reset link
            </h2>
            <p className="text-slate-500 text-sm">
              The reset link is missing or invalid. Please request a new
              password reset link.
            </p>
          </div>
          <Link
            to="/forgot-password"
            className="w-3/4 btn-primary py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 no-underline"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
      <div
        className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden"
        style={{ background: "var(--gradient-glow)" }}
      >
        <div className="relative m-0">
          <div className="max-h-30 size-60">
            <img src="/logo.png" alt="ElexoPlus Logo" />
          </div>
        </div>

        <div className="relative max-w-md mt-0">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={18} className="text-amber-300" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-200">
              Employee Management System
            </span>
          </div>
          <h1 className="font-display text-5xl font-black leading-[1.05] mb-4">
            Set a new
            <br />
            <span className="text-amber-400">password</span>
            <br />
            to continue.
          </h1>
          <p className="text-white/70 text-base leading-relaxed">
            Choose a strong password you haven&apos;t used before.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-10">
          {FEATURE_CARDS.map((f) => (
            <div
              key={f.label}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 hover:border-amber-400 transition-colors"
            >
              <f.icon size={18} className="text-amber-300 mb-2" />
              <p className="text-sm font-bold">{f.label}</p>
              <p className="text-[11px] text-white/50">{f.value}</p>
            </div>
          ))}
        </div>

        <div className="relative text-xs text-white/60 mt-6 text-left">
          &copy; {new Date().getFullYear()} ElexoPlus Pvt.Ltd &middot; All
          Rights Reserved
        </div>
      </div>

      <div className="flex items-center justify-center flex-col gap-4 p-6 md:p-12 relative">
        {success ? (
          <div className="w-3/4 space-y-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mx-auto">
              <CheckCircle size={32} className="text-green-400" />
            </div>
            <div className="text-center">
              <h2 className="font-display text-3xl font-black tracking-tight mb-2">
                Password updated
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Your password has been reset successfully. Redirecting to the
                login page...
              </p>
            </div>
            <Link
              to={ROUTES.LOGIN}
              className="w-full btn-primary py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 no-underline"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8 w-3/4">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors no-underline mb-6"
              >
                <ArrowLeft size={14} /> Back to reset password
              </Link>
              <h2 className="font-display text-3xl font-black tracking-tight mb-2">
                Create new password
              </h2>
              <p className="text-slate-500 text-sm">
                Your password must be at least 6 characters.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 w-3/4" noValidate>
              <div>
                <label
                  htmlFor="new-password"
                  className="text-xs font-bold text-slate-300 uppercase tracking-wider"
                >
                  New Password
                </label>
                <div className="mt-2 relative">
                  <Lock
                    size={24}
                    className="absolute font-extrabold left-4 top-1/2 -translate-y-1/2 text-amber-400"
                    aria-hidden="true"
                  />
                  <input
                    id="new-password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/40 border pl-12 pr-12 py-3.5 rounded-2xl text-sm text-slate-50 font-semibold outline-none focus:border-amber-400 focus:bg-black transition-all"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600"
                    aria-label={showPass ? "Hide password" : "Show password"}
                  >
                    {showPass ? (
                      <EyeOff size={24} className="text-amber-400" />
                    ) : (
                      <Eye size={24} className="text-amber-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="text-xs font-bold text-slate-300 uppercase tracking-wider"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <Lock
                    size={24}
                    className="absolute font-extrabold left-4 top-1/2 -translate-y-1/2 text-amber-400"
                    aria-hidden="true"
                  />
                  <input
                    id="confirm-password"
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full bg-black/40 border pl-12 pr-12 py-3.5 rounded-2xl text-sm text-slate-50 font-semibold outline-none focus:border-amber-400 focus:bg-black transition-all"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600"
                    aria-label={
                      showConfirm ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirm ? (
                      <EyeOff size={24} className="text-amber-400" />
                    ) : (
                      <Eye size={24} className="text-amber-400" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3.5 cursor-pointer rounded-2xl font-black text-base flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                    aria-hidden="true"
                  />
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
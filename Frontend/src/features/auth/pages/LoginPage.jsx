import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MOCK_USERS from "../mock/mockUsers";
import ROLES from "../../../config/roles";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  FileText,
  Wallet,
} from "lucide-react";
import authService from "../services/authService";
// import authStorage from "../utils/authStorage";
import { validateLogin } from "../config/validationRules";
import { ROUTES } from "../../../routes/routes";
import useAuth from "../hooks/useAuth";

const FEATURE_CARDS = [
  { icon: FileText, label: "Employee Master", value: "Complete profiles" },
  { icon: FileText, label: "Payroll", value: "Automated processing" },
  { icon: Wallet, label: "Payslips", value: "PDF generation" },
  { icon: ShieldCheck, label: "Compliance", value: "PF/ESI/PT/TDS" },
];

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const DEMO_USERS = MOCK_USERS.filter(
    (user) =>
      user.role !== ROLES.SALES_EXECUTIVE ||
      user.email === "nisha@elexoplus.com",
  );

  // const validateForm = () => {
  //     if (!email.trim()) {
  //         setError('Email is required');
  //         return false;
  //     }
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     if (!emailRegex.test(email.trim())) {
  //         setError('Please enter a valid email address');
  //         return false;
  //     }
  //     if (!password) {
  //         setError('Password is required');
  //         return false;
  //     }
  //     if (password.length < 6) {
  //         setError('Password must be at least 6 characters');
  //         return false;
  //     }
  //     return true;
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // if (!validateForm()) return;

    const validationError = validateLogin({
      email,
      password,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    //   setError("Authentication service not available. Please try again later.");
    // }, 1500);

    setLoading(true);

    setTimeout(() => {
      const response = authService.login({
        email,
        password,
      });

      setLoading(false);

      if (!response.success) {
        setError(response.message);
        return;
      }

      login(response.user);

      navigate(ROUTES.DASHBOARD);
    }, 600);
  };

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
          <div className="">
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
            <p className="text-white/70 text-base leading-relaxed">
              Complete HR, payroll, attendance, and compliance suite for modern
              Indian enterprises.
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
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-amber-300">
              Demo Login Credentials
            </h3>

            <div className="space-y-3">
              {DEMO_USERS.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b border-white/10 pb-2 last:border-none"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {user.designation}
                    </p>

                    <p className="text-xs text-white/60">{user.email}</p>
                  </div>

                  <span className="text-xs font-bold text-amber-300">
                    Elexo@123
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="relative text-xs text-white/60 mt-6 text-left">
          &copy; {new Date().getFullYear()} ElexoPlus Pvt.Ltd &middot; All
          Rights Reserved
        </div>
      </div>

      <div className="flex items-center justify-center flex-col gap-4 p-6 md:p-12 relative">
        <div className="mb-10 w-3/4">
          <h2 className="font-display text-3xl font-black tracking-tight mb-2">
            Welcome back
          </h2>
          <p className="text-slate-500 text-sm">
            Sign in to access the Employee Management System
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-3/4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              Email Address
            </label>
            <div className="mt-2 relative">
              <Mail
                size={24}
                className="absolute font-extrabold left-4 top-1/2 -translate-y-1/2 text-amber-400"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border pl-12 pr-4 py-3.5 rounded-2xl text-sm text-slate-50 font-semibold outline-none focus:border-amber-400 focus:bg-black transition-all"
                placeholder="you@elexoplus.com"
                autoComplete="email"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-xs font-bold text-slate-300 uppercase tracking-wider"
            >
              Password
            </label>
            <div className="mt-2 relative">
              <Lock
                size={24}
                className="absolute font-extrabold left-4 top-1/2 -translate-y-1/2 text-amber-400"
                aria-hidden="true"
              />
              <input
                id="password"
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border pl-12 pr-12 py-3.5 rounded-2xl text-sm text-slate-50 font-semibold outline-none focus:border-amber-400 focus:bg-black transition-all"
                placeholder="••••••••"
                autoComplete="current-password"
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

          {error && (
            <div
              className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold"
              role="alert"
              aria-live="polite"
            >
              {error}
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-300 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-amber-400 text-rose-600 focus:ring-rose-500"
              />
              Remember me
            </label>
            <Link
              to="/forgot-password"
              className="font-bold text-amber-300 hover:text-rose-700 no-underline"
            >
              Forgot password?
            </Link>
          </div>

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
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

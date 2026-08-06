import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Sparkles, ShieldCheck, FileText, Wallet, CheckCircle } from 'lucide-react';
import authService from '../services/authService';

const FEATURE_CARDS = [
    { icon: FileText, label: 'Employee Master', value: 'Complete profiles' },
    { icon: FileText, label: 'Payroll', value: 'Automated processing' },
    { icon: Wallet, label: 'Payslips', value: 'PDF generation' },
    { icon: ShieldCheck, label: 'Compliance', value: 'PF/ESI/PT/TDS' },
];

function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const validateForm = () => {
        if (!email.trim()) {
            setError('Email is required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        setLoading(true);
        const response = await authService.forgotPassword({ email });
        setLoading(false);

        if (!response.success) {
            setError(response.message);
            return;
        }

        setSent(true);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative overflow-hidden">
            <div className="relative hidden lg:flex flex-col justify-between p-12 text-white overflow-hidden" style={{ background: 'var(--gradient-glow)' }}>
                <div className="relative m-0">
                    <div className="max-h-30 size-60">
                        <img src="/logo.png" alt="ElexoPlus Logo" />
                    </div>
                </div>

                <div className="relative max-w-md mt-0">
                    <div className="">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles size={18} className="text-amber-300" />
                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-200">Employee Management System</span>
                        </div>
                        <h1 className="font-display text-5xl font-black leading-[1.05] mb-4">
                            Manage your<br />
                            <span className="text-amber-400">entire workforce</span><br />
                            in one place.
                        </h1>
                        <p className="text-white/70 text-base leading-relaxed">
                            Complete HR, payroll, attendance, and compliance suite for modern Indian enterprises.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-10">
                        {FEATURE_CARDS.map((f) => (
                            <div key={f.label} className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur hover:bg-white/10 hover:border-amber-400 transition-colors">
                                <f.icon size={18} className="text-amber-300 mb-2" />
                                <p className="text-sm font-bold">{f.label}</p>
                                <p className="text-[11px] text-white/50">{f.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="relative text-xs text-white/60 mt-6 text-left">
                    &copy; {new Date().getFullYear()} ElexoPlus Pvt.Ltd &middot; All Rights Reserved
                </div>
            </div>

            <div className="flex items-center justify-center flex-col gap-4 p-6 md:p-12 relative">
                {sent ? (
                    <div className="w-3/4 space-y-6">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mx-auto">
                            <CheckCircle size={32} className="text-green-400" />
                        </div>
                        <div className="text-center">
                            <h2 className="font-display text-3xl font-black tracking-tight mb-2">Check your email</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">
                                We&apos;ve sent a password reset link to <span className="text-slate-300 font-semibold">{email}</span>.
                                Please check your inbox and follow the instructions to reset your password.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-amber-400/5 border border-amber-400/20 text-amber-300 text-xs leading-relaxed">
                            Didn&apos;t receive the email? Check your spam folder or try again in a few minutes.
                        </div>
                        <Link
                            to="/login"
                            className="w-full btn-primary py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 no-underline"
                        >
                            <ArrowLeft size={16} /> Back to Sign In
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 w-3/4">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors no-underline mb-6"
                            >
                                <ArrowLeft size={14} /> Back to sign in
                            </Link>
                            <h2 className="font-display text-3xl font-black tracking-tight mb-2">Reset password</h2>
                            <p className="text-slate-500 text-sm">
                                Enter your registered email and we&apos;ll send you a link to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 w-3/4" noValidate>
                            <div>
                                <label htmlFor="reset-email" className="text-xs font-bold text-slate-300 uppercase tracking-wider">Email Address</label>
                                <div className="mt-2 relative">
                                    <Mail size={24} className="absolute font-extrabold left-4 top-1/2 -translate-y-1/2 text-amber-400" aria-hidden="true" />
                                    <input
                                        id="reset-email"
                                        type="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full bg-black/40 border pl-12 pr-4 py-3.5 rounded-2xl text-sm text-slate-50 font-semibold outline-none focus:border-amber-400 focus:bg-black transition-all"
                                        placeholder="you@elexoplus.com"
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-semibold" role="alert" aria-live="polite">
                                    {error}
                                </div>
                            )}

                            <button type="submit" disabled={loading}
                                className="w-full btn-primary py-3.5 cursor-pointer rounded-2xl font-black text-base flex items-center justify-center gap-2 disabled:opacity-70">
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                                ) : (
                                    'Send Reset Link'
                                )}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordPage;

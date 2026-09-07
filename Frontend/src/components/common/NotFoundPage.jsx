import { useNavigate } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import { ROUTES } from "../../routes/routes";
import authStorage from "../../features/auth/utils/authStorage";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = authStorage.isAuthenticated();

  const handleGoHome = () => {
    navigate(isAuthenticated ? ROUTES.DASHBOARD : ROUTES.LOGIN);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(244,194,28,.08), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(244,194,28,.05), transparent 40%),
            var(--color-background)
          `,
        }}
      />

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <img src="/logo.png" alt="ElexoPlus" className="h-14 mb-10 opacity-80" />

        <div className="relative mb-6">
          <span
            className="text-[10rem] font-black leading-none tracking-tighter"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(244,194,28,.15))",
            }}
          >
            404
          </span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-foreground-muted text-sm max-w-md leading-relaxed mb-10">
          The page you are looking for does not exist or has been moved.
          Please check the URL or navigate back.
        </p>

        <div className="flex items-center gap-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl border border-border text-foreground-muted text-sm font-semibold hover:border-primary hover:text-primary hover:shadow-[0_0_20px_rgba(244,194,28,.1)] transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft size={16} />
            Go Back
          </button>

          <button
            onClick={handleGoHome}
            className="btn-primary flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold cursor-pointer"
          >
            <Home size={16} />
            {isAuthenticated ? "Dashboard" : "Login"}
          </button>
        </div>

        <p className="mt-12 text-xs text-foreground-muted/60">
          &copy; {new Date().getFullYear()} ElexoPlus Pvt.Ltd
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;

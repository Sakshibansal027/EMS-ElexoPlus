const InlineLoader = ({ message = "Loading...", className = "" }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 ${className}`}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/15 blur-xl animate-pulse" />
        <img
          src="/logo.png"
          alt="ElexoPlus"
          className="relative h-12 w-12 animate-[loaderPulse_1.8s_ease-in-out_infinite]"
        />
      </div>

      <div className="flex flex-col items-center gap-2.5">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
        <p className="text-sm font-medium text-foreground-muted tracking-wide">
          {message}
        </p>
      </div>

      <style>{`
        @keyframes loaderPulse {
          0%, 100% { transform: scale(1); opacity: 0.85; }
          50% { transform: scale(1.06); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InlineLoader;

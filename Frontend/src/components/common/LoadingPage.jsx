const LoadingPage = ({ message = "Loading..." }) => {

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(244,194,28,.10), transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(244,194,28,.06), transparent 50%),
            var(--color-background)
          `,
        }}
      />

      <div className="relative flex flex-col items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
          <img
            src="/logo.png"
            alt="ElexoPlus"
            className="relative h-20 w-20 animate-[logoSpin_2s_ease-in-out_infinite]"
          />
        </div>

        <div className="flex flex-col items-center gap-3">
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
      </div>

      <style>{`
        @keyframes logoSpin {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(2deg); }
          50% { transform: scale(1) rotate(0deg); }
          75% { transform: scale(1.05) rotate(-2deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;

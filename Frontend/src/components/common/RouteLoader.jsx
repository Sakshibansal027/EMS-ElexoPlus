import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const RouteLoader = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname;
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 350);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[10000]">
      <div className="h-0.5 w-full bg-border overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{
            animation: "routeLoadBar 0.35s ease-out forwards",
          }}
        />
      </div>
      <style>{`
        @keyframes routeLoadBar {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default RouteLoader;

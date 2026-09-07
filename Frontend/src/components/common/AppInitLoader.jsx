import { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";

const AppInitLoader = ({ children }) => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitializing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (initializing) {
    return <LoadingPage message="Initializing..." />;
  }

  return children;
};

export default AppInitLoader;

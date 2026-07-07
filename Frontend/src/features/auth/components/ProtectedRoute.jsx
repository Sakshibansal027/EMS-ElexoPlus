import { Navigate } from "react-router-dom";

import authStorage from "../utils/authStorage";
import { ROUTES } from "../../../routes/routes";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authStorage.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

export default ProtectedRoute;
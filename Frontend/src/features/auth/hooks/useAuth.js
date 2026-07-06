import authStorage from "../utils/authStorage";

const useAuth = () => {
  const user = authStorage.getCurrentUser();

  const login = (userData) => {
    authStorage.setCurrentUser(userData);
  };

  const logout = () => {
    authStorage.removeCurrentUser();
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: authStorage.isAuthenticated(),
  };
};

export default useAuth;
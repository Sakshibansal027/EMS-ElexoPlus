import authStorage from "../utils/authStorage";

const useAuth = () => {
  const user = authStorage.getCurrentUser();

  const login = (userData, token, remember = false) => {
    authStorage.setCurrentUser(userData, remember);
    authStorage.setToken(token, remember);
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
const AUTH_KEY = "elexoplus_user";

const setCurrentUser = (user) => {
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

const getCurrentUser = () => {
  const user = sessionStorage.getItem(AUTH_KEY);

  return user ? JSON.parse(user) : null;
};

const removeCurrentUser = () => {
  sessionStorage.removeItem(AUTH_KEY);
};

const isAuthenticated = () => {
  return !!getCurrentUser();
};

export default {
  setCurrentUser,
  getCurrentUser,
  removeCurrentUser,
  isAuthenticated,
};
const TOKEN_KEY = "elexoplus_token";
const USER_KEY = "elexoplus_user";
const REMEMBER_KEY = "elexoplus_remember";

const rememberStorage = () => {
  const remember =
    localStorage.getItem(REMEMBER_KEY) === "true" || sessionStorage.getItem(REMEMBER_KEY) === "true";

  return remember ? localStorage : sessionStorage;
};

const setCurrentUser = (user, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;

  if (remember) {
    localStorage.setItem(REMEMBER_KEY, "true");
    sessionStorage.removeItem(REMEMBER_KEY);
  } else {
    sessionStorage.setItem(REMEMBER_KEY, "false");
    localStorage.removeItem(REMEMBER_KEY);
  }

  storage.setItem(USER_KEY, JSON.stringify(user));
};

const getCurrentUser = () => {
  const user = rememberStorage().getItem(USER_KEY);

  return user ? JSON.parse(user) : null;
};

const setToken = (token, remember = false) => {
  const storage = remember ? localStorage : sessionStorage;

  storage.setItem(TOKEN_KEY, token);
};

const getToken = () => {
  return rememberStorage().getItem(TOKEN_KEY);
};

const removeCurrentUser = () => {
  [localStorage, sessionStorage].forEach((storage) => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
    storage.removeItem(REMEMBER_KEY);
  });
};

const isAuthenticated = () => {
  return !!getToken();
};

export default {
  setCurrentUser,
  getCurrentUser,
  removeCurrentUser,
  setToken,
  getToken,
  isAuthenticated,
};

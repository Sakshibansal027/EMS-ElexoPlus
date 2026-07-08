import MOCK_USERS from "../mock/mockUsers";

const login = ({ email, password }) => {
  const user = MOCK_USERS.find(
    (item) =>
      item.email.trim().toLowerCase() === email.trim().toLowerCase() &&
      item.password === password,
  );

  if (!user) {
    return {
      success: false,
      message: "Invalid username or password.",
      user: null,
    };
  }

  return {
    success: true,
    message: "Login successful.",
    user,
  };
};

const authService = {
  login,
};

export default authService;

export const validateLogin = ({ email, password }) => {
  if (!email.trim()) {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return "Please enter a valid email address.";
  }

  if (!password.trim()) {
    return "Password is required.";
  }

  return null;
};
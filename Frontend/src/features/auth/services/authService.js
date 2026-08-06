import client from "../../../api/client";

const login = async ({ email, password }) => {
  try {
    const { data } = await client.post("/auth/login", { email, password });

    return {
      success: true,
      message: data.message || "Login successful.",
      user: data.user,
      token: data.token,
      refreshToken: data.refresh_token,
    };
  } catch (error) {
    const message =
      error.response?.data?.message || "Unable to connect. Please try again.";

    return {
      success: false,
      message,
      user: null,
      token: null,
      refreshToken: null,
    };
  }
};

const getCurrentUser = async () => {
  const { data } = await client.get("/auth/me");

  return data.success ? data.user : null;
};

const logout = async () => {
  try {
    await client.post("/auth/logout");
  } catch {
    // Server errors shouldn't block local logout.
  }
};

const forgotPassword = async ({ email }) => {
  try {
    const { data } = await client.post("/auth/forgot-password", { email });

    return {
      success: true,
      message: data.message || "Reset link sent.",
      resetToken: data.reset_token,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to send reset link.",
      resetToken: null,
    };
  }
};

const resetPassword = async ({ token, password }) => {
  try {
    const { data } = await client.post("/auth/reset-password", { token, password });

    return {
      success: true,
      message: data.message || "Password reset successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Unable to reset password.",
    };
  }
};

const authService = {
  login,
  getCurrentUser,
  logout,
  forgotPassword,
  resetPassword,
};

export default authService;

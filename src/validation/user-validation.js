export const validateUser = (user) => {
  const { email, password, name } = user;

  let errors = null;

  if (!email) {
    errors = { ...errors, email: "Email is required" };
  }
  if (!password) {
    errors = { ...errors, password: "Password is required" };
  }
  if (!name) {
    errors = { ...errors, name: "Name is required" };
  }
  if (errors) {
    return {
      success: false,
      errors,
    };
  }
  if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors = { ...errors, email: "Invalid email format" };
  }

  if (password.length < 8 || password.length > 20) {
    errors = {
      ...errors,
      password: "Password should be between 8 and 20 characters long",
    };
  }
  if (errors) {
    return {
      success: false,
      errors,
    };
  }
  return {
    success: true,
    errors,
  };
};

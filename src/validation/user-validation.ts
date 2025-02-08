export type UserInputType = {
  email: string;
  password: string;
  name: string;
}

export type ErrorType = {
  email?: string;
  password?: string;
  name?: string;
}
export const validateUser = (user: UserInputType): {
  success: boolean;
  errors: ErrorType;
} => {
  const { email, password, name } = user;

  let errors: ErrorType = {};

  if (!email) {
    errors = { ...errors, email: "Email is required" };
  }
  if (!password) {
    errors = { ...errors, password: "Password is required" };
  }
  if (!name) {
    errors = { ...errors, name: "Name is required" };
  }
  if (Object.keys(errors).length) {
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
  if (Object.keys(errors).length) {
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

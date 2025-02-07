export const validatePassword = (password) => {
  if (!password || password.length < 8 || password.length > 20) {
    return false;
  }
  return true;
};

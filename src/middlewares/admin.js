export const adminVerification = (req, res, next) => {
  if (req.session?.user?.role === "admin") {
    return next();
  }
  return res
    .status(401)
    .json({ success: false, error: "You are not authenticated." });
};

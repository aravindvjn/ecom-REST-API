export const isUserAuthenticated = (req, res,next) => {

  if (req.session && req.session.user.id) {
    return next();
  }
  return res.status(404).json({ message: "Unauthenticated User" });
};

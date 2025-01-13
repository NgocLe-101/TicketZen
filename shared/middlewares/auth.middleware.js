const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

const createSessionIfNotExists = (req, res, next) => {
  if (!req.session) {
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: "Session creation failed" });
      }
      next();
    });
  } else {
    next();
  }
};

export { ensureAuthenticated, createSessionIfNotExists };

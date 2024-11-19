const passport = require("passport");
// Controller register
exports.getRegisterPage = (req, res) => {
  const message = req.flash("error");
  res.render("register", { errorMessage: message }); // Render register page
};

exports.postRegister = async (req, res, next) => {
  passport.authenticate("local-register", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", info.message);
      return res.redirect("/auth/register");
    }
    res.render("verify_email", { email: user.email });
  })(req, res, next);
};

// Controller login
exports.getLoginPage = (req, res) => {
  res.render("login", { errorMessage: req.flash("error") }); // Render login page
};

// Controller verify email
exports.resendEmail = async (req, res) => {
  const { email } = req.body;
  // TODO: Send email verification
  // Using mock data for now
  res.json({ success: true });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect("/auth/login");
};

// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};
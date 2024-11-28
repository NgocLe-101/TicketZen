const passport = require("passport");
const transporter = require("../configs/nodemailer");
const User = require("../models/user.model");

// Controller register
exports.getRegisterPage = (req, res) => {
  res.render("register", { errorMessage: null }); // Render register page
};

exports.postRegister = async (req, res, next) => {
  passport.authenticate("local-register", async (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("register", { errorMessage: info.message });
    }
    // Send verification email
    await transporter.sendMail({
      from: {
        name: "TicketZen",
        address: process.env.EMAIL,
      },
      to: user.email,
      subject: "Verify your email",
      html: `
        <h1>Welcome to TicketZen</h1>
        <p>Click the link below to verify your email</p>
        <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${user.verification_token}">Verify your email</a>
        `,
    });
    res.render("verify_email", { email: user.email });
  })(req, res, next);
};

// Controller login
exports.getLoginPage = (req, res) => {
  res.render("login", { errorMessage: null }); // Render login page
};

exports.postLogin = async (req, res, next) => {
  passport.authenticate("local-login", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login", { errorMessage: info.message });
    }
    req.logIn(
      { id: user.id, username: user.username, email: user.email },
      (err) => {
        if (err) return next(err);
        return res.redirect("/?login=success");
      }
    );
  })(req, res, next);
};

// Controller verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.verifyUser(token);
    if (!user) {
      return res.render("verification_page", {
        verificationSuccess: false,
      });
    }
    res.render("verification_page", { verificationSuccess: true });
  } catch (error) {
    console.log(error);
    return res.render("verification_page", {
      verificationSuccess: false,
    });
  }
};

exports.resendEmail = async (req, res) => {
  const { email } = req.body;
  // TODO: Send email verification
  // Using mock data for now
  res.json({ success: true });
};

// Controller profile
exports.getProfilePage = (req, res) => {
  console.log(req.user);
  res.render("profile", { user: req.user }); // Render profile page
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/auth/login");
  });
};

// Middleware to check if user is authenticated
exports.ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

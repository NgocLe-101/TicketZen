const passport = require("passport");
const transporter = require("../configs/nodemailer");
const User = require("../models/user.model");
const crypto = require("crypto");
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

// Controller forgot password
exports.getForgotPasswordPage = (req, res) => {
  res.render("forgot-password", { errorMessage: "" });
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;

  // Check if email exists in the database
  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.render("forgot-password", {
      errorMessage: "Email is not exist.",
    });
  }

  const verificationCode = crypto.randomBytes(4).toString("hex").toUpperCase();
  // Save verification code to database
  await User.saveVerificationCode(user.id, verificationCode);

  const mailOptions = {
    from: {
      name: "TicketZen",
      address: process.env.EMAIL,
    },
    to: email,
    subject: "Password Reset Verification Code",
    text: `Your verification code is: ${verificationCode}. Please enter this code to proceed with your password reset process.`,
  };

  try {
    await transporter.sendMail(mailOptions); // Send email

    // Redirect to reset password page
    res.redirect(`/auth/reset-password?email=${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.render("forgot-password", {
      errorMessage:
        "An error occurred while sending the email. Please try again.",
    });
  }
};

// Controller reset password
exports.getResetPasswordPage = (req, res) => {
  const { email } = req.query;
  res.render("reset-password", { email: email, errorMessage: "" });
};

exports.postResetPassword = async (req, res) => {
  const { email, verificationCode, newPassword } = req.body;

  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.render("reset-password", {
      email,
      errorMessage: "Email is not exist.",
    });
  }

  const codeRecord = await User.getVerificationCode(user.id);

  if (!codeRecord || codeRecord.verification_code !== verificationCode) {
    return res.render("reset-password", {
      email,
      errorMessage: "Verification code is expired or invalid.",
    });
  }

  // Update new password
  await User.updatePassword(user.id, newPassword);

  // await db("verification_codes").where({ user_id: user.id }).del();

  res.redirect("/auth/login");
};



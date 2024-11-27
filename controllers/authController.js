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
    const message = await transporter.sendMail({
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
    console.log("Email sent: " + message.messageId);
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
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/?login=success");
    });
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

// Controller forgot password
exports.getForgotPasswordPage = (req, res) => {
  res.render("forgot-password", { errorMessage: "" });
};

exports.postForgotPassword = async (req, res) => {
  const { email } = req.body;

  // Kiểm tra nếu email có tồn tại trong hệ thống
  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.render("forgot-password", {
      errorMessage: "Email không tồn tại trong hệ thống",
    });
  }

  // Tạo mã xác nhận ngẫu nhiên
  const verificationCode = crypto.randomBytes(4).toString("hex").toUpperCase(); 

  // Lưu mã xác nhận vào cơ sở dữ liệu
  // await User.saveVerificationCode(user.id, verificationCode);

  // Gửi mã xác nhận qua email
  const mailOptions = {
    from: {
        name: "TicketZen",
        address: process.env.EMAIL,
      },
    to: email,
    subject: "Mã xác nhận thay đổi mật khẩu",
    text: `Mã xác nhận của bạn là: ${verificationCode}. Hãy nhập mã này để tiếp tục quá trình thay đổi mật khẩu.`,
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);

    // Chuyển người dùng tới trang nhập mã xác nhận
    res.redirect(`/auth/reset-password?email=${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.render("forgot-password", {
      errorMessage: "Đã xảy ra lỗi trong quá trình gửi email. Vui lòng thử lại.",
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

  // Kiểm tra mã xác nhận từ DB
  const user = await User.getUserByEmail(email);
  if (!user) {
    return res.render("reset-password", {
      email,
      errorMessage: "Email không tồn tại trong hệ thống.",
    });
  }

  const codeRecord = await User.getVerificationCode(user.id);
  if (!codeRecord || codeRecord.verification_code !== verificationCode) {
    return res.render("reset-password", {
      email,
      errorMessage: "Mã xác nhận không đúng hoặc đã hết hạn.",
    });
  }

  // Cập nhật mật khẩu mới cho người dùng
  await User.updatePassword(user.id, newPassword);

  // Xóa mã xác nhận sau khi sử dụng
  await db("verification_codes").where({ user_id: user.id }).del();

  res.redirect("/auth/login");
};
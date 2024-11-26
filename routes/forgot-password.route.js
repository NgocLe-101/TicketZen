const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = require("../configs/nodemailer");
const { getUserByEmail } = require("../models/user.model.js");

router.get("/forgot-password", (req, res) => {
  res.render("forgot-password", { errorMessage: "" });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return res.render("forgot-password", {
      errorMessage: "Email không tồn tại trong hệ thống",
    });
  }

  const verificationCode = crypto.randomBytes(4).toString("hex").toUpperCase();

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Mã xác nhận thay đổi mật khẩu",
    text: `Mã xác nhận của bạn là: ${verificationCode}. Hãy nhập mã này để tiếp tục quá trình thay đổi mật khẩu.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect(`/auth/reset-password?email=${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    res.render("forgot-password", {
      errorMessage: "Đã xảy ra lỗi trong quá trình gửi email. Vui lòng thử lại.",
    });
  }
});

module.exports = router;

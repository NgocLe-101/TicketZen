router.post("/reset-password", async (req, res) => {
    const { email, verificationCode, newPassword } = req.body;
  
    // Kiểm tra mã xác nhận
    const user = await getUserByEmail(email);
    if (!user || user.verificationCode !== verificationCode) {
      return res.render("reset-password", {
        email,
        errorMessage: "Mã xác nhận không đúng.",
      });
    }
  
    // Cập nhật mật khẩu mới cho người dùng
    await updateUserPassword(email, newPassword); 
  
    res.redirect("/auth/login");
  });
  
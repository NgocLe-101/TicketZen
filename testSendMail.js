const transporter = require("./configs/nodemailer");

let token = "1234567890";

const mailOptions = {
  from: {
    name: "TicketZen",
    address: process.env.EMAIL,
  },
  to: "ngocle266tqt@gmail.com",
  subject: "Verify your email",
  html: `
        <h1>Welcome to TicketZen</h1>
        <p>Click the link below to verify your email</p>
        <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${token}">Verify your email</a>
        `,
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email sent: " + info.response);
  }
});

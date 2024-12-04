import transporter from '../configs/nodemailer.js';

const MAIL_OPTIONS = {
  from: {
    name: "TicketZen",
    address: process.env.EMAIL,
  },
};
// Doesn't work. Don't know why
const sendVerificationEmail = async (email, token) => {
  const mailOptions = {
    ...MAIL_OPTIONS,
    to: email,
    subject: "Verify your email",
    html: `
        <h1>Welcome to TicketZen</h1>
        <p>Click the link below to verify your email</p>
        <a href="${process.env.CLIENT_URL}/auth/verify-email?token=${token}">Verify your email</a>
        `,
  };

  return transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export default {sendVerificationEmail}

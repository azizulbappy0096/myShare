// import modules
const nodemailer = require("nodemailer");

const sendMail = async ({ emailFrom, emailTo, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.SMT__HOST,
    port: process.env.SMT__PORT,
    secure: false,
    auth: {
      user: process.env.SMT__USER,
      pass: process.env.SMT__PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `MyShare myshare462@gmail.com`,
    to: emailTo,
    subject: "Share file with MyShare",
    text,
    html,
  });
};

module.exports = sendMail;

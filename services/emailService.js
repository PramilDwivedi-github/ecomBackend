const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

const sendEmail = async (mailTransporter, mailDetails) => {
  await mailTransporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.log(err);
      return err;
    } else return "success";
  });
};

module.exports = { mailTransporter, sendEmail };

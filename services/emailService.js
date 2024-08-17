const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const getMailTransporter = async () => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
  const access_token = await oAuth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.email,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: access_token,
    },
  });
}

const sendEmail = async (mailDetails) => {
  const mailTransporter = await getMailTransporter();
  mailTransporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.log(err);
      return err;
    } else return "success";
  });
};

module.exports = { sendEmail };

const sendEmail = async (mailDetails, mailTransporter) => {
  await mailTransporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.log(err);
      return err;
    } else return "success";
  });
};

module.exports = { sendEmail };

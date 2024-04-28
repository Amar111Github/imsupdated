
const nodemailer = require("nodemailer");
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service : 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: true,

    auth: {
      user: process.env.MAIL,
      pass: process.env.PASSWORD
    },
  });

  async function sendMessage(otp, email) {
    // console.log('otp number : ', otp);
    // console.log('this is a user email : ', email);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"Fred Foo 👻" <${process.env.MAIL}>`, // sender address
      to: "mohandandriyal2001@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
      html: otp, // html body
    });
    
}

module.exports = sendMessage
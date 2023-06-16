const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const dotenv = require('dotenv');
const path = require('path');
const smtpTransport = require('nodemailer-smtp-transport');
dotenv.config({path: '../.env'});
const { generateOTP } = require('./otpGenerator');

const transporter = nodemailer.createTransport(
  smtpTransport({
    host: 'smtp.office365.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER_NAME,
      pass: process.env.EMAIL_PASSWORD
    }
  })
);

transporter.use(
  'compile',
  hbs({
    viewEngine: {
      extName: '.handlerbars',
      partialsDir: path.resolve(__dirname, '../views/templates'),
      defaultLayout: false,
    },
    viewPath: path.resolve(__dirname, '../views/templates'),
  })
);

function generateHashedEmail(email) {
  if (!email) {
    return ''; 
  }
  const emailParts = email.split('@');
  const emailProvider = emailParts[1].split('.')[0];
  const hashedEmail = emailParts[0].slice(0, Math.floor(emailParts[0].length / 2)) + '**@' + emailProvider + '.com';

  return hashedEmail;
}

function sendEmailWithOTP(name, email, otp) {
  const mailOptions = {
    from: 'beccountable@outlook.com',
    to: email,
    subject: 'Verify your Account',
    template: 'verifyOTP',
    context: {
      title: 'Verify OTP',
      name,
      hashedEmail: generateHashedEmail(email),
      heading: 'Welcome to my app',
      message: `Your OTP is: ${otp}`
    }
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error.message);
    } else {
      console.log('Email sent successfully!');
    }
  });
};

// Example usage:
const email = 'seun.thedeveloper@gmail.com';
const otp = generateOTP();
const name = 'Seun';

//sendEmailWithOTP(name, email, otp);

// console.log(path.join(mainDirectory, 'views', 'templates'))

module.exports = { sendEmailWithOTP };

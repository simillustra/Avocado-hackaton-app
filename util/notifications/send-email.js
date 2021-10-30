const CONFIG = require('@config/config');
const nodemailer = require('nodemailer');

exports.sendEmail = (template, data) => {
   const { emailTpl } = require(`./templates/${template}`);
   const readyTpl = emailTpl(data);

   if (!data.from) {
      data.from = 'no_reply@avocado.com';
   }

   data.html = readyTpl.html;
   data.text = readyTpl.text;

   return new Promise((resolve, reject) => {
      const transporter = nodemailer.createTransport({
         host: 'smtp.ethereal.email',
         port: 587,
         auth: {
            user: 'wj3uqn6u4tsyvft7@ethereal.email',
            pass: '8GjP84KtuG4AkEq5ap'
         }
      });
      transporter.sendMail({ ...data }).then((info) => {
         console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
         resolve();
      }).catch(() => {
         reject(err);
      });
   });
};

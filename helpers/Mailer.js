'use strict';

const mailer = require('nodemailer');

module.exports.client = null;

module.exports.config = {};

module.exports.connect = function (mail) {
  const transporter = mailer.createTransport(mail);

  if (transporter) {
    console.info('Mailer in connected');
    // TODO:: find a place to put all app global configs (not in base)
    this.client = transporter;
    this.config = mail;
  } else {
    throw new Error('nodemailer:: createTransport failed');
  }
}

module.exports.sendRoute = function (req, res, next) {
  const {body} = req;
  module.exports.sendMail(body.from, body.to, body.subject, body.body, body.headers)
    .then(result => {
      module.exports.client.close();
      return res.send(result);
    })
    .catch(error => {
      next(new Error(error));
    });
}

module.exports.sendMail = function (from, to, subject, body, attachments = []) {
  return new Promise((resolve, reject) => {
    module.exports.client.sendMail({
      from,
      to,
      subject,
      html: body,
      attachments
    }, (error, info) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

const emailService = require('../services/emailService');

function sendMail(req, res){
    emailService.sendMail(req.body, res);
}

module.exports = {
    sendMail
}
var School = require('../models/School');
var config = require('../config.json');
var nodemailer = require('nodemailer');
var smtpConfig = {
    service: 'Gmail',
    auth: {
        user: config.email,
        pass: config.password
    }
};
var transporter = nodemailer.createTransport('smtp', smtpConfig);

module.exports = {
    sendEmail: function(req, res, next) {
        var preDo = req.body.shouldDo ? '<h4><b> I suggest that we do ' : '';
        var shouldDo = preDo ? (req.body.shouldDo.indexOf(',') > -1 ? 'lessons ' + req.body.shouldDo + '.</b></h4>' : 'lesson ' + req.body.shouldDo + '.</b></h4>') : '';
        var postDo = req.body.doReason ? 'Reasoning: ' + req.body.doReason : '';
        var preSkip = req.body.shouldSkip ? '<h4><b> I suggest that we skip ' : '';
        var shouldSkip = preSkip ? (req.body.shouldSkip.indexOf(',') > -1 ? 'lessons ' + req.body.shouldSkip + '.</b></h4>' : 'lesson ' + req.body.shouldSkip + '.</b></h4>') : '';
        var postSkip = req.body.skipReason ? 'Reasoning: ' + req.body.skipReason : '';
        var href = "http://"+config.domain+"/#/" + req.body.subject.toLowerCase() + "/modify";

        function randomString(length, chars) {
            var result = '';
            for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
            return result;
        }

        var newAdminKey = {
            key: randomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            subject: req.body.subject.toLowerCase(),
            shouldDo: req.body.shouldDo,
            shouldSkip: req.body.shouldSkip
        }

        School.findByIdAndUpdate({
            _id: req.body.school_id
        }, { '$push': {'adminKeys': newAdminKey}}, function(err, resp) {
            if (err) console.log(err);
        })

        var mailOptions = {
            from: req.body.user.username + '<dummy_email@gmail.com>', // sender address
            replyTo: req.body.user.email,
            to: req.body.adminEmail, // list of receivers
            subject: req.body.subject + ' Homework Update Request', // Subject line
            html: '<html style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;font-family: sans-serif;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;font-size: 62.5%;-webkit-tap-highlight-color: rgba(0,0,0,0);"><head style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"><title style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;">HW Update</title><meta charset="utf-8" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"><meta name="viewport" content="width=device-width, initial-scale=1" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"><link rel="stylesheet" href="http://netdna.bootstrapcdn.com/bootstrap/3.0.3/css/bootstrap.min.css" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"></head><body style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 0;font-family: &quot;Helvetica Neue&quot;,Helvetica,Arial,sans-serif;font-size: 14px;line-height: 1.428571429;color: #333;background-color: #fff;"><div>' + preDo + shouldDo + postDo + preSkip + shouldSkip + postSkip + '</div><div style="width:28%;margin:auto;text-align:center"><button class="btn btn-primary" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 10px 0;font-family: inherit;font-size: 14px;line-height: 1.428571429;text-transform: none;cursor: pointer;-webkit-appearance: button;display: inline-block;padding: 6px 12px;margin-bottom: 0;font-weight: normal;text-align: center;white-space: nowrap;vertical-align: middle;background-image: none;border: 1px solid transparent;border-radius: 4px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;-o-user-select: none;user-select: none;color: #fff;background-color: #428bca;border-color: #357ebd;width:100%"><a href="' + href + '" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;background: transparent;color: #fff;text-decoration: none;">Modify HW</a></button><button class="btn btn-success" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;margin: 10px 0;font-family: inherit;font-size: 14px;line-height: 1.428571429;text-transform: none;cursor: pointer;-webkit-appearance: button;display: inline-block;padding: 6px 12px;margin-bottom: 0;font-weight: normal;text-align: center;white-space: nowrap;vertical-align: middle;background-image: none;border: 1px solid transparent;border-radius: 4px;-webkit-user-select: none;-moz-user-select: none;-ms-user-select: none;-o-user-select: none;user-select: none;color: #fff;background-color: #5cb85c;border-color: #4cae4c;width:100%"><a href="mailto:' + req.body.user.email + '?subject=Re: Feedback on ' + req.body.subject + ' Homework Update Request&body=Request Approved. Use the admin key below to update the homework. %0D%0A%0D%0AAdmin Key: ' + newAdminKey.key + '%0D%0A%0D%0ADo: '+req.body.shouldDo+'%0D%0ASkip: '+req.body.shouldSkip+'%0D%0A%0D%0A'+href+'" style="-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;background: transparent;color: #fff;text-decoration: none;">Send Admin Key</a></button></div></body></html>'
        };
        transporter.sendMail(mailOptions, function(err, response) {
            console.log(err || response);
            if (err) {
                res.send(err);
            } else {
                res.send(response)
            }

	    transporter.close();
            
        });
    }
}

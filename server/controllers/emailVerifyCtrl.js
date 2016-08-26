var mongoose = require('mongoose');
var nev = require('email-verification')(mongoose);
var School = require('../models/School');
var User = require('../models/User');
var config = require('../config.json');
var bcrypt = require('bcrypt');

var myHasher = function(password, tempUserData, insertTempUser, callback) {
    var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
    return insertTempUser(hash, tempUserData, callback);
};

nev.configure({
    verificationURL: 'http://'+config.domain+'/email-verification/${URL}',
    persistentUserModel: User,
    tempUserCollection: 'temporary_users',

    transportOptions: {
        service: 'Gmail',
        auth: {
            user: config.email,
            pass: config.password
        }
    },
    hashingFunction: myHasher,
    verifyMailOptions: {
        from: 'Do Not Reply <saxonApp.do.not.reply@gmail.com>',
        replyTo: 'Do Not Reply <do_not_reply@gmail.com>',
        subject: 'Please confirm your saxonmathhw.org account',
        html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
        text: 'Please confirm your account by clicking the following link: ${URL}'
    },
    // shouldSendConfirmation: function(){},
    // shouldSendConfirmation: false,
    confirmMailOptions: {
        from: 'Do Not Reply <saxonApp.do.not.reply@gmail.com>',
        replyTo: 'Do Not Reply <do_not_reply@gmail.com>',
        subject: 'saxonmathhw.org account verified!',
        html: '<p>Your account has been successfully verified.</p>',
    }
}, function(err, options) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('configured: ' + (typeof options === 'object'));
});

nev.generateTempUserModel(User, function(err, tempUserModel) {
    if (err) {
        console.log(err);
        return
    }
    console.log('generated temp user model: ' + (typeof tempUserModel === 'function'));
});

module.exports = {
    emailLinkRedirect: function(req, res, next) {
        var url = req.params.URL;
        nev.confirmTempUser(url, function(err, user) {
            if (user) {
                res.redirect('/')
            } else {
                return res.status(404).send('ERROR: confirming temp user FAILED');
            }
        })
    },

    create: function(req, res, next) {
        School.findOne(req.body.school, function(err, existingSchool) {
            if (!existingSchool) {
                var newSchool = new School(req.body.school);

                function ProblemConstructor(subject, lessonNum, problemNum, lessonRef) {
                    this.subject = subject;
                    this.lessonNum = lessonNum;
                    this.problemNum = problemNum;
                    this.lessonRef = lessonRef;
                    this.assigned = true;
                }

                var subjectNames = ['alg', 'geo', 'alg2'];
                var subjects = [alg, geo, alg2];
                for (var i = 0; i < subjectNames.length; i++) {
                    var subjectName = subjectNames[i];
                    var subject = subjects[i];
                    for (var j = 1; j <= 120; j++) {
                        for (var k = 1; k <= 30; k++) {
                            var problem = new ProblemConstructor(subjectName, j, k, subject[Object.keys(subject)[j - 1]][k]);
                            switch (subjectName) {
                                case 'alg':
                                    newSchool.algProblems.push(problem)
                                    break;
                                case 'geo':
                                    newSchool.geoProblems.push(problem)
                                    break;
                                case 'alg2':
                                    newSchool.alg2Problems.push(problem)
                                    break;
                            }
                        }
                    }
                }

                // new user with a new school
                newSchool.save(function(err, new_school) {
                    var user = req.body.users.self;
                    user.school_name = req.body.school.name;
                    user.school_city = req.body.school.city;
                    user.school_state = req.body.school.state;
                    user.school_id = new_school._id;
                    var newUser = new User(user);

                    // email verification stuff 
                    emailVerify(newUser);
                })
            } else {
                // new user(s) with existing school
                var user, count = 0;
                for (key in req.body.users) {
                    count++;
                    user = req.body.users[key];
                    if (user.type == 'student') {
                        user.verificationCode = '1234';
                        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
                    }
                    user.school_name = req.body.school.name;
                    user.school_city = req.body.school.city;
                    user.school_state = req.body.school.state;
                    user.school_id = existingSchool._id;
                    var newUser = new User(user)
                    if (user.type == 'student') {
                        if (count == Object.keys(req.body.users).length) {
                            newUser.save(function(err, user) {
                                if (err) console.log(err);
                                return err ? res.send({
                                    msg: err.errors.verificationCode.message,
                                    flag: 'error'
                                }) : res.send({
                                    msg: 'Successfully created student accounts'
                                })
                            })
                        } else {
                            newUser.save(function(err, user) {
                                if (err) console.log(err);
                            })
                        }
                    } else {
                        emailVerify(newUser);
                    }
                }
            }
        })

        function emailVerify(newUser) {
            nev.createTempUser(newUser, function(err, existing, newTempUser) {
                if (err) {
                    return res.send({
                        msg: err.errors.verificationCode.message,
                        flag: 'error'
                    });
                }

                if (existing) {
                    return res.json({
                        msg: 'The email you entered is already associated with another account.',
                        flag: 'error'
                    });
                }

                if (newTempUser) {
                    var URL = newTempUser[nev.options.URLFieldName];
                    nev.sendVerificationEmail(newUser.email, URL, function(err, info) {
                        if (err) {
                            return res.status(404).send({
                                msg: 'ERROR: sending verification email FAILED', 
                                flag: 'error'
                            });
                        }
                        res.json({
                            msg: 'An email has been sent to you. Please check it to verify your account.',
                            info: info
                        });
                    })
                } else {
                    res.json({
                        msg: 'You have already signed up. Please check your email to verify your account.', 
                        flag: 'error'
                    });
                }
            })
        }
    }
}

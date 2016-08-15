var User = require('./../../models/user');
var fs = require('fs');
var path = require('path');
var formidable = require('formidable');
var Jimp = require("jimp");
var gm = require('gm');

var randomString = require('./../../middleware/random-string');

module.exports = function(router, passport, auth, nconf, mode) {
    router.get('/upload', auth, function (req, res) {
        if (req.user) res.sendStatus(404);
        console.log(path.join(__dirname + '/../'));
        res.sendFile('qwerty.html', {root: path.join(__dirname + '/../')});
    });

    router.post('/avatar', auth, function (req, res, next) {
        console.log(req.user);

        console.log('Try to upload...');
        //res.send('Uploaded!');
        var form = new formidable.IncomingForm();
        form.parse(req);
        var avatarName = randomString(10);
        form.on('fileBegin', function (name, file) {

            file.path = path.join(__dirname + '/../../../public/uploads/' + avatarName + '.jpg');
            console.log(file.path);
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
            console.log(req.user);
            User.findOneAndUpdate({'username': req.user.username}, {avatarName: avatarName}, {new: true}, function (err, user) {
                if (err) {
                    console.error(err);
                }
                if (user) {
                    Jimp.read(path.join(__dirname + '/../../../public/uploads/' + avatarName + '.jpg'), function (err, img) {
                        if (err) {
                            throw err;
                            return res.send(err);
                        }
                        img
                            .cover(2000, 1200)            // resize
                            .quality(1)                 // set JPEG quality
                            .blur(20)
                            .write(path.join(__dirname + '/../../../public/uploads/' + avatarName + '-origin.png'), function () {
                                gm(path.join(__dirname + "/../../../public/uploads/" + avatarName + "-origin.png"))
                                    .composite(path.join(__dirname + "/../../../public/uploads/bg.png"))
                                    .geometry('+0+0')
                                    .write(path.join(__dirname + "/../../../public/uploads/" + avatarName + '-bg.jpg'), function (err) {
                                        if (err) {
                                            console.log('Error');
                                            console.log(err);
                                            return res.send(err);
                                        }
                                        console.log('All done');
                                        user.isBg = true;
                                        user.save(function (err) {
                                            if (err) {
                                                console.log('Error in saving');
                                                return res.send(err);
                                            }
                                            console.log('Bg is setted by ' + user.username);
                                            return res.send(user);
                                        });
                                    });
                            });
                    });
                    console.log('Uploading done: ');
                    console.log(user);
                }
                return user;
            });

        });

        form.on('error', function (err1, err2, err3) {
            console.log('error');
            console.log(err1);
            console.log(err2);
            console.log(err3);
        })
        form.on('aborted', function (err1, err2, err3) {
            console.log('aborted');
            console.log(err1);
            console.log(err2);
            console.log(err3);
        })
        //res.send('uploaded!!!');
    });


    router.post('/upload', auth, function (req, res, next) {
        console.log(req.body);
        console.log(req);
        var avatarName = randomString(10);


        console.log('Try to upload...');
        //res.send('Uploaded!');
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('fileBegin', function (name, file) {

            file.path = path.join(__dirname + '/../../../public/uploads/photos/' + avatarName + '.jpg');
            console.log(file.path);
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
            console.log(req.user);

            Jimp.read(path.join(__dirname + '/../../../public/uploads/photos/' + avatarName + '.jpg'), function (err, img) {
                if (err) {
                    throw err;
                    return res.send(err);
                }
                img.cover(250, 250)
                    .write(path.join(__dirname + '/../../../public/uploads/photos/' + avatarName + '-small.png'), function () {
                        console.log('Successfully resized!');
                    });
            });
            return res.send(avatarName);

        });

        form.on('error', function (err1, err2, err3) {
            console.log('error');
            console.log(err1);
            console.log(err2);
            console.log(err3);
            res.send(err1, err2, err3);
        })
        form.on('aborted', function (err1, err2, err3) {
            console.log('aborted');
            console.log(err1);
            console.log(err2);
            console.log(err3);
            res.send(err1, err2, err3);
        })
        //res.send('uploaded!!!');
    });
}
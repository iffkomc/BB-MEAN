var Meepo = require('./../../middleware/meepo');
var findIndexOfKey = require('./../../middleware/findIndexOfKey');
var User = require('./../../models/user');
var Battle = require('./../../models/battle');
var Photo = require('./../../models/photo');
var Brand = require('./../../models/brand');
var Notification = require('./../../models/notifications');
var getAllActiveBattles = function(userId, cb){
    var err = '';
    return Battle.find({
        winner: '',
        idPhoto2: {$ne: null},
        date: {$ne: null}
    }, function (err, battles) {
        if(err) {
            err = 'Iffkomc: Error with finding';
            return cb(err);
        }

        if(battles.length) {
            var meepo = new Meepo();
            meepo.push(undefined, battles.length);
            meepo.callback(function(){
                return cb(null, battles);
            });
            return battles.forEach(function(battle){
                console.log(battle);
                checkBattleIsExpired(battle, function () {
                    var localFlag = false;
                    battle.viewsIds.forEach(function (item) {
                        if (item == userId) {
                            localFlag = true;
                        }
                    });
                    if (localFlag) {
                        err = null;
                        return meepo.itemComplete();
                    }
                    else {
                        battle.viewsIds.push(userId);
                        battle.save(function (err) {
                            if (err) {
                                err = 'Iffkomc: Error with saving';
                                //return cb(err);
                                return meepo.itemComplete();
                            }
                            else {
                                err = '';
                                return meepo.itemComplete();
                            }
                        });
                    }
                });

            });
        }
        return cb(null, battles);
    });
}
var checkActiveBattles = function (userId, cb) {
    var err = '';
    return Battle.findOne({
        winner: '',
        id1: userId,
        idPhoto2: {$ne: null},
        date: {$ne: null}
    }, function (err, battle) {
        if (err) {
            err = 'Iffkomc: Error with finding';
            return cb(err);
        }
        if(battle){
            console.log(battle);
            return checkBattleIsExpired(battle, function () {
                var localFlag = false;
                battle.viewsIds.forEach(function (item) {
                    if (item == userId) {
                        localFlag = true;
                    }
                });
                if (localFlag) {
                    err = null;
                    return cb(null, battle);
                }
                else {
                    battle.viewsIds.push(userId);
                    battle.save(function (err) {
                        if (err) {
                            err = 'Iffkomc: Error with saving';
                            return cb(err);
                        }
                        else {
                            err = '';
                            return cb(null, battle);
                        }
                    });
                }
            });
        }
        if (!battle) {
            return Battle.findOne({
                winner: '',
                id2: userId,
                idPhoto2: {$ne: null}
            }, function (err, battle) {
                if (err) {
                    err = 'Iffkomc: Error with finding';
                    return cb(err);
                }
                if (!battle) {
                    err = null;
                    return cb(err);
                }
                if (battle) {
                    console.log(battle);
                    checkBattleIsExpired(battle, function () {
                        var localFlag = false;
                        battle.viewsIds.forEach(function (item) {
                            if (item == userId) {
                                localFlag = true;
                            }
                        });
                        if (localFlag) {
                            err = null;
                            return cb(null, battle);
                        }
                        else {
                            battle.viewsIds.push(userId);
                            battle.save(function (err) {
                                if (err) {
                                    err = 'Iffkomc: Error with saving';
                                    return cb(err);
                                }
                                else {
                                    err = '';
                                    return cb(null, battle);
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            //
            //
            //
            if (battle) {
                return checkBattleIsExpired(battle, function () {
                    console.log(battle);
                    var localFlag = false;
                    battle.viewsIds.forEach(function (item) {
                        if (item == userId) {
                            localFlag = true;
                        }
                    });
                    if (localFlag) {
                        err = null;
                        return cb(null, battle);
                    }
                    else {
                        battle.viewsIds.push(userId);
                        battle.save(function (err) {
                            if (err) {
                                err = 'Problem with saving';
                                return cb(err, battle);
                            }
                            else {
                                err = null;
                                return cb(null, battle);
                            }
                        });
                    }
                });
            }
        }
    });
}
var checkBattleIsExpired = function (battle, callback) {
    var expires = (new Date(battle.date)).getTime();
    var current = (new Date()).getTime();
    var delay = 1000 * 60 * 60 * 24;
    //var delay = 1000 * 60;
    if (expires + delay <= current) {
        console.error('Expired!!!');
        if (battle.rateIdsPhoto1 && battle.rateIdsPhoto2) {
            console.log('I am here!');
            if (battle.rateIdsPhoto1.length > battle.rateIdsPhoto2.length) {
                console.log('and  here 1!');
                battle.winner = battle.id1;

                var isWinnerFirst = true;
            }
            else if (battle.rateIdsPhoto1.length < battle.rateIdsPhoto2.length) {
                console.log('and  here 2!');
                battle.winner = battle.id2;

                var isWinnerFirst = false;
            }
            else{
                return callback();
            }

            if(isWinnerFirst !== undefined){
                var photoFinishedMeepo = new Meepo();
                photoFinishedMeepo.push(undefined, 2);
                photoFinishedMeepo.callback(function () {
                    console.log('checkBattleIsExpired done');
                    return battle.save(callback);
                });
                Photo.findById(battle.idPhoto1, function(err, photo){
                    if(err || !photo){
                        console.log(err);
                        photoFinishedMeepo.itemComplete();
                    }
                    photo.isFinished = true;
                    photo.save(function(err, photo){
                        if(err || !photo){
                            console.log(err);
                            return photoFinishedMeepo.itemComplete();
                        }
                        return photoFinishedMeepo.itemComplete();
                    });
                });
                Photo.findById(battle.idPhoto2, function(err, photo){
                    if(err || !photo){
                        console.log(err);
                        return photoFinishedMeepo.itemComplete();
                    }
                    photo.isFinished = true;
                    photo.save(function(err, photo){
                        if(err || !photo){
                            console.log(err);
                            return photoFinishedMeepo.itemComplete();
                        }
                        return photoFinishedMeepo.itemComplete();
                    });
                });

            }
        }


    }
    else {
        console.error('not expired :(');
        return callback();
    }
}
module.exports = function (router, passport, auth, nconf, mode) {

    router.get('/battles', auth, function (req, res) {
        if(req.query.type && req.query.type == 'all'){
            console.log('start find all battles');
            getAllActiveBattles(req.user._id, function (err, battles) {
                if(err){
                    console.log('err in get all battles');
                    return res.sendStatus(500);
                }
                else{
                    return res.send(battles);
                }
            });
        }
        if (req.query.type && req.query.type == 'active' && req.query.idUser) {
            return checkActiveBattles(req.query.idUser, function (err, battle) {
                if(err || !battle){
                    return res.send(500);
                }
                if(battle){
                    return res.send(battle);
                }
            });
        }
        else if(req.query.type && req.query.type == 'active'){
            return checkActiveBattles(req.user._id, function (err, battle) {
                if(err || !battle){
                    console.log('Iffkomc: Not found');
                    return res.send(500);
                }
                if(battle){
                    return res.send(battle);
                }
            });
        }
        else if (req.query.type && req.query.type == 'friends') {
            console.log('friends');
            var friendsId = [];
            var findedBattles = [];
            var friends = req.user.followings;
            console.log(friends);

            var asyncParallel = new Meepo();
            asyncParallel.push(undefined, friends.length);
            friends.forEach(function (item) {
                User.findOne({username: item}, function (err, user) {
                    if (err || !user) {
                        console.log('no user with such username or error occured');
                        return asyncParallel.itemComplete();
                    }

                    friendsId.push(user._id);
                    return asyncParallel.itemComplete();
                });
            });
            asyncParallel.callback(function () {
                console.log(friendsId);

                var asyncBattleFinder = new Meepo();
                asyncBattleFinder.push(undefined, friendsId.length * 2);
                asyncBattleFinder.callback(function () {
                    for (var i = 0; i < findedBattles.length; i++) {
                        for (var j = i + 1; j < findedBattles.length; j++) {
                            if(findedBattles[i] && findedBattles[j]){
                                if (findedBattles[i]._id.toString() == findedBattles[j]._id.toString()) {
                                    console.log('=');
                                    findedBattles.splice(j, 1);
                                    i--;
                                    j--;
                                }
                                else {
                                    console.log(findedBattles[i]._id);
                                    console.log('!=');
                                    console.log(findedBattles[j]._id);

                                }
                            }
                        }
                    }

                    res.send(findedBattles);
                });
                friendsId.forEach(function (id) {
                    Battle.findOne({id1: id, date: {$ne: ''}, winner: ''}, function (err, battle) {
                        if (err || !battle) {
                            asyncBattleFinder.itemComplete();
                            console.log('battles isn\'t exists or error');
                        }
                        if (battle) {
                            checkBattleIsExpired(battle, function () {
                                findedBattles.push(battle);
                                console.log(battle._id);
                                if (!(findIndexOfKey(req.user._id, battle.viewsIds) + 1)) {
                                    battle.viewsIds.push(req.user._id);
                                }
                                battle.save(function (err) {
                                    if (err) {
                                        asyncBattleFinder.itemComplete();
                                        console.log('battles isn\'t exists or error');
                                    }
                                    asyncBattleFinder.itemComplete();
                                });
                                //battles.forEach(function (item) {
                                //    findedBattles.push(item);
                                //    console.log(item._id);
                                //    item.
                                //    asyncBattleFinder.itemComplete();
                                //})
                            });
                        }
                    });
                    Battle.findOne({id2: id, date: {$ne: ''}, winner: ''}, function (err, battle) {
                        if (err || !battle) {
                            asyncBattleFinder.itemComplete();
                            console.log('battles isn\'t exists or error');
                        }
                        if (battle) {
                            checkBattleIsExpired(battle, function () {
                                findedBattles.push(battle);
                                console.log(battle._id);
                                if (!(findIndexOfKey(req.user._id, battle.viewsIds) + 1)) {
                                    battle.viewsIds.push(req.user._id);
                                }
                                battle.save(function (err) {
                                    if (err) {
                                        asyncBattleFinder.itemComplete();
                                        console.log('battles isn\'t exists or error');
                                    }
                                    asyncBattleFinder.itemComplete();
                                });
                            });
                        }
                    });
                });
            });
        }
        else if (req.query.id) {
            var id = req.query.id;
            Battle.findById(id, function (err, battle) {
                if (err || !battle) {
                    console.log('battles isn\'t exists or error');
                    return res.sendStatus(500);
                }
                if (battle) {
                    checkBattleIsExpired(battle, function () {
                        res.send(battle);
                    });
                }
            });
        }
        else if (req.query.photoId) {
            Battle.findOne({idPhoto1: req.query.photoId}, function (err, battle) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                if (battle) {
                    checkBattleIsExpired(battle, function () {
                        res.send(battle);
                    });
                }
                if (!battle) {
                    Battle.findOne({idPhoto2: req.query.photoId}, function (err, battle) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        if (!battle) {
                            return res.sendStatus(400);
                        }
                        if (battle) {
                            checkBattleIsExpired(battle, function () {
                                res.send(battle);
                            });
                        }
                    });
                }

            });
        }
    });
    router.put('/battles', auth, function (req, res) {
        var user = req.user;
        var battleId = req.query.id;
        var voteTo = req.query.vote;

        if (!battleId || !voteTo) {
            console.log('!battleId || !voteTo');
            return res.sendStatus(500);
        }

        return Battle.findById(battleId, function (err, battle) {
            if (err || !battle) {
                console.log('error || !battle');
                return res.sendStatus(500);
            }
            if (battle) {
                //
                //  check if user has old votes
                //
                var isVoted = false;
                battle.rateIdsPhoto1.forEach(function (item, index) {
                    if (item == user._id) {
                        isVoted = true;
                    }
                });
                battle.rateIdsPhoto2.forEach(function (item, index) {
                    if (item == user._id) {
                        isVoted = true;
                    }
                });

                if (isVoted) {
                    console.log('isVoted == true');
                    return res.send(battle);
                }

                if (voteTo == '1') {
                    battle.rateIdsPhoto1.push(user._id);

                    var notify = new Notification();
                    notify.type = 'vote';
                    notify.idOwner = battle.id1;
                    notify.itemId = battle.idPhoto1;
                    notify.idUser = user._id;
                    notify.date = new Date();
                    notify.viewed = false;

                }
                else if (voteTo == '2') {
                    battle.rateIdsPhoto2.push(user._id);

                    var notify = new Notification();
                    notify.type = 'vote';
                    notify.idOwner = battle.id2;
                    notify.itemId = battle.idPhoto2;
                    notify.idUser = user._id;
                    notify.date = new Date();
                    notify.viewed = false;
                }
                else {
                    console.log('voteTo != 1 && != 2');
                    return res.sendStatus(500);
                }

                notify.save(function (err) {
                    if (err) {
                        console.log('error while battle save');
                        return res.sendStatus(500);
                    }

                    battle.save(function (err) {
                        if (err) {
                            console.log('error while battle save');
                            return res.sendStatus(500);
                        }
                        return res.send(battle);
                    });
                });
            }
        });
    });

    router.delete('/create-photo', auth, function (req, res) {
        var battleId = req.query.id;
        //
        //  mark notify as REJECTED
        //
        Notification.findOne({idOwner: req.user._id, itemId: battleId}, function (err, notify) {
            if (err || !notify) {
                console.log('fail find notify');
                res.sendStatus(400);
            }
            notify.status = 'rejected';
            notify.save(function (err) {
                if (err) {
                    console.log('fail reject');
                    return err;
                }
                //
                //  mark battle as REJECTED
                //
                Battle.findById(battleId, function (err, battle) {

                    if (err || !battle) {
                        console.log('problem delete create-photo request');
                        return res.sendStatus(400);
                    }
                    //
                    //  check if battle is not yours
                    //
                    if (battle.id2 != req.user._id) {
                        console.log('not allowed');
                        return res.sendStatus(400);
                    }
                    //
                    //  MAIN part
                    //
                    if (battle.idPhoto2 == undefined) {
                        console.log('deleted');
                        var tmpId2 = battle.id2;
                        battle.id2 = undefined;
                        battle.save(function (err, battle) {
                            var notify = new Notification();
                            notify.type = 'reject';
                            notify.idOwner = battle.id1;
                            notify.idUser = tmpId2;
                            notify.date = new Date();
                            notify.viewed = false;
                            notify.itemId = battleId;

                            notify.save(function () {
                                console.log('Notification is CREATED');
                                return res.send(notify);
                            });
                        });
                    }
                    else {
                        console.log('skipped');
                    }
                });
            });

        });
    });

    router.put('/create-photo', auth, function (req, res) {
        var photo = new Photo();
        //
        // if no data about battle, return error
        //

        if (!req.body.battleForm) res.sendStatus(500);
        var battleForm = req.body.battleForm;
        var battleId = req.query.id;

        Notification.findOne({idOwner: req.user._id, itemId: battleId, status: undefined}, function (err, notify) {
            if (err || !notify) {
                console.log('err find notify');
                return res.sendStatus(400);
            }
            notify.status = 'applied';

            notify.save(function (err) {
                if (err) {
                    console.log('problem save notify');
                    return res.sendStatus(500);
                }
                //
                //  create photo user2
                //
                console.error(battleForm);
                console.log('----------');
                console.error(battleForm);
                console.log('----------');
                console.error(battleForm);
                console.log('----------');
                console.error(battleForm);
                console.log('----------');
                console.error(battleForm);
                console.log('----------');
                photo.ownerId = req.user._id;
                photo.isFinished = false;
                photo.startDate = new Date();
                if (battleForm.price)
                    photo.price = battleForm.price;
                if (battleForm.comment)
                    photo.comment = battleForm.comment;
                if (battleForm.photo)
                    photo.name = battleForm.photo;
                else {
                    res.sendStatus(500);
                }
                photo.save(function (err) {
                    console.log('Saving anc creating');
                    if (err) {
                        return res.sendStatus(500);
                    }
                    var meepo = new Meepo();
                    //
                    //  creating Brands
                    //
                    if (battleForm.brands) {
                        if (battleForm.brands.length) {
                            meepo.push(undefined, battleForm.brands.length);
                            for (var i = 0; i < battleForm.brands.length; i++) {
                                (function (k) {
                                    var counter = k;
                                    Brand.findOne({name: battleForm.brands[counter].value}, function (err, brand) {
                                        console.log('!!!!!!!');
                                        console.error(battleForm.brands[counter]);
                                        console.log('!!!!!!!');
                                        if (err) {
                                            console.error(err);
                                            return meepo.itemComplete();
                                        }
                                        if (!brand) {
                                            var brand = new Brand();
                                            brand.name = battleForm.brands[counter].value;
                                        }
                                        brand.photosId.push(photo.id);
                                        brand.save(function (err) {
                                            if (err){
                                                console.error(err);
                                                return meepo.itemComplete();
                                            }
                                            photo.brands.push({
                                                position: battleForm.brands[counter].position,
                                                brandId: brand._id
                                            });
                                            photo.save(function (err) {
                                                if (err) {
                                                    console.error(err);
                                                    return meepo.itemComplete();
                                                }
                                                meepo.itemComplete();
                                            });

                                        })
                                    });
                                })(i);
                            }
                        }
                    }
                    meepo.callback(function () {
                        Battle.findById(battleId, function (err, battle) {
                            if (err || !battle) {
                                console.log('battle accepting problems');
                                return res.sendStatus(400);
                            }
                            if (battle.id2 != req.user._id) {
                                console.log('user had already rejected battle');
                                return res.sendStatus(400);
                            }

                            checkActiveBattles(battle.id1, function (err, actBattle) {
                                if(err){
                                    return res.send(err);
                                }
                                else if(actBattle){
                                    return res.send(500);
                                }
                                else if(!actBattle){
                                    battle.idPhoto2 = photo._id;
                                    battle.date = new Date();
                                    battle.save(function (err) {
                                        if (err) {
                                            console.log(err);
                                            return res.send(500);
                                        }
                                        //
                                        // create notifications for id1, id2 and their followers
                                        //
                                        var asyncParallel = new Meepo();
                                        asyncParallel.push(undefined, 4);
                                        asyncParallel.callback(function () {
                                            return res.send(battle);
                                        });
                                        var now = new Date();

                                        var notify1 = new Notification();
                                        notify1.type = 'userBattleStarted';
                                        notify1.idOwner = battle.id1;
                                        notify1.idUser = battle.id2;
                                        notify1.viewed = false;
                                        notify1.itemId = battle._id;
                                        notify1.date = now;

                                        notify1.save(function (err) {
                                            if(err){
                                                console.log(err);
                                            }
                                            console.log('Notification is CREATED 1');
                                            asyncParallel.itemComplete();
                                            //res.send(notify);
                                        });

                                        var notify2 = new Notification();
                                        notify2.type = 'userBattleStarted';
                                        notify2.idOwner = battle.id2;
                                        notify2.idUser = battle.id1;
                                        notify2.viewed = false;
                                        notify2.itemId = battle._id;
                                        notify2.date = now;

                                        notify2.save(function (err) {
                                            if(err){
                                                console.log(err);
                                            }
                                            console.log('Notification is CREATED 2');
                                            asyncParallel.itemComplete();
                                            //res.send(notify);
                                        });

                                        User.findById(battle.id1, function (err, user) {
                                            if (err || !user) {
                                                console.log(err);
                                                asyncParallel.itemComplete();
                                            }
                                            else if (user) {
                                                var battleUser = user;
                                                var innerMeepo3 = new Meepo();
                                                innerMeepo3.push(undefined, user.followers.length);
                                                innerMeepo3.callback(function () {
                                                    console.log('Notification is CREATED 3');
                                                    asyncParallel.itemComplete();
                                                });
                                                for (var i = 0; i < user.followers.length; i++) {
                                                    User.findOne({username: user.followers[i]}, function (err, user) {
                                                        if (err || !user) {
                                                            console.log(err);
                                                            return innerMeepo3.itemComplete();
                                                        }
                                                        else if (user) {
                                                            var notify = new Notification();
                                                            notify.type = 'followingBattleStarted';
                                                            notify.idOwner = user._id;
                                                            notify.idUser = battleUser._id;
                                                            notify.viewed = false;
                                                            notify.itemId = battle._id;
                                                            notify.date = now;
                                                            notify.save(function (err) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    return innerMeepo3.itemComplete();
                                                                }
                                                                innerMeepo3.itemComplete();
                                                                //res.send(notify);
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });

                                        User.findById(battle.id2, function (err, user) {
                                            if (err || !user) {
                                                console.log(err);
                                                return asyncParallel.itemComplete();
                                            }
                                            else if (user) {
                                                var battleUser = user;
                                                var innerMeepo4 = new Meepo();
                                                innerMeepo4.push(undefined, user.followers.length);
                                                innerMeepo4.callback(function () {
                                                    console.log('Notification is CREATED 4');
                                                    asyncParallel.itemComplete();
                                                });
                                                for (var i = 0; i < user.followers.length; i++) {
                                                    User.findOne({username: user.followers[i]}, function (err, user) {
                                                        if (err || !user) {
                                                            console.log(err);
                                                            return innerMeepo4.itemComplete();
                                                        }
                                                        else if (user) {
                                                            var notify = new Notification();
                                                            notify.type = 'followingBattleStarted';
                                                            notify.idOwner = user._id;
                                                            notify.idUser = battleUser._id;
                                                            notify.viewed = false;
                                                            notify.itemId = battle._id;
                                                            notify.date = now;
                                                            notify.save(function (err) {
                                                                if (err) {
                                                                    console.log(err);
                                                                    return asyncParallel.itemComplete();
                                                                }
                                                                innerMeepo4.itemComplete();
                                                                //res.send(notify);
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    });
                                }

                            });


                        });
                    });

                });
            });
        });

    });
    router.post('/create-photo', auth, function (req, res) {
        //
        //  instructions
        //  1) check if not exist photo with non-ended battle. If it is then return this photo
        //  2) create creating photo
        //  3) create brands
        //  4) create battle
        //  5) send invite (create notification)
        //
        var continueFunction = function () {
            var photo = new Photo();
            //
            // if no data about battle, return error
            //
            if (!req.body.battleForm) res.sendStatus(500);
            var battleForm = req.body.battleForm;
            return checkActiveBattles(req.user._id, function(err, battle){
               if(err || battle){
                   res.send(500);
               }
                else{
                   //
                   //  create photo user1
                   //
                   photo.ownerId = req.user._id;
                   photo.isFinished = false;
                   photo.startDate = new Date();
                   if (battleForm.price)
                       photo.price = battleForm.price;
                   if (battleForm.type)
                       photo.type = battleForm.type;
                   if (battleForm.comment)
                       photo.comment = battleForm.comment;
                   if (battleForm.photo)
                       photo.name = battleForm.photo;
                   else {
                       res.sendStatus(500);
                   }
                   photo.save(function (err) {
                       if (err) {
                           return res.sendStatus(500);
                       }

                       //
                       //  random battle type
                       //
                       if (photo.type == 'random' || photo.type == false || !photo.type) {
                           console.log('type is random');
                           //
                           //  try find any battles without user2 with type random
                           //
                           Battle.find({
                               id2: "",
                               idPhoto2: null,
                               winner: '',
                               type: 'random'
                           }, function (err, battles) {

                               if (err) {
                                   console.log(err);
                                   return res.send(err);
                               }
                               //
                               //  try find free random battles
                               //  if it is then add user1 to field user2 and start Battle
                               //
                               if (battles.length) {
                                   console.log(battles);
                                   //handle this
                                   var index = 0;
                                   for (var i = 0; i < battles.length; i++) {
                                       if (battles[i].id1 != req.user._id) {
                                           // JOIN user to battle
                                           index = i;
                                           break;
                                       }
                                   }
                                   if(battles[index].id1 == req.user._id){
                                       return res.status(500).send('');
                                   }
                                   var battle = battles[index];
                                   battle.id2 = req.user._id;
                                   battle.idPhoto2 = photo._id;
                                   battle.date = new Date();
                                   battle.save(function (err) {
                                       if (err) {
                                           console.log(err);
                                       }
                                       //
                                       //  save Battle
                                       //
                                       //
                                       // todo #iffkomc send Notify to user1 (joined to battle) and user2 (joined to battle)
                                       //
                                       var asyncParallel = new Meepo();
                                       asyncParallel.push(undefined, 4);
                                       asyncParallel.callback(function () {
                                           res.send(battle);
                                       });
                                       var now = new Date();

                                       var notify1 = new Notification();
                                       notify1.type = 'userBattleStarted';
                                       notify1.idOwner = battle.id1;
                                       notify1.idUser = battle.id2;
                                       notify1.viewed = false;
                                       notify1.itemId = battle._id;
                                       notify1.date = now;

                                       notify1.save(function () {
                                           console.log('Notification is CREATED');
                                           asyncParallel.itemComplete();
                                           //res.send(notify);
                                       });

                                       var notify2 = new Notification();
                                       notify2.type = 'userBattleStarted';
                                       notify2.idOwner = battle.id2;
                                       notify2.idUser = battle.id1;
                                       notify2.viewed = false;
                                       notify2.itemId = battle._id;
                                       notify2.date = now;

                                       notify2.save(function () {
                                           console.log('Notification is CREATED');
                                           asyncParallel.itemComplete();
                                           //res.send(notify);
                                       });

                                       User.findById(battle.id1, function (err, user) {
                                           if (err || !user) {
                                               console.log('Notification is CREATED');
                                               asyncParallel.itemComplete();
                                           }
                                           else if (user) {
                                               var battleUser = user;
                                               var randomMeepo3 = new Meepo();
                                               randomMeepo3.push(undefined, user.followers.length);
                                               randomMeepo3.callback(function () {
                                                   asyncParallel.itemComplete();
                                               });
                                               for (var i = 0; i < user.followers.length; i++) {
                                                   User.findOne({username: user.followers[i]}, function (err, user) {
                                                       if (err || !user) {
                                                           console.log(err);
                                                           randomMeepo3.itemComplete();
                                                       }
                                                       else if (user) {
                                                           var notify = new Notification();
                                                           notify.type = 'followingBattleStarted';
                                                           notify.idOwner = user._id;
                                                           notify.idUser = battleUser._id;
                                                           notify.viewed = false;
                                                           notify.itemId = battle._id;
                                                           notify.date = now;
                                                           notify.save(function (err) {
                                                               if(err){
                                                                   console.log(err);
                                                               }
                                                               console.log('Notification is CREATED');
                                                               randomMeepo3.itemComplete();
                                                               //res.send(notify);
                                                           });
                                                       }
                                                   });
                                               }
                                           }
                                       });

                                       User.findById(battle.id2, function (err, user) {
                                           if (err || !user) {
                                               console.log('Notification is CREATED');
                                               asyncParallel.itemComplete();
                                           }
                                           else if (user) {
                                               var battleUser = user;
                                               var randomMeepo4 = new Meepo();
                                               randomMeepo4.push(undefined, user.followers.length);
                                               randomMeepo4.callback(function () {
                                                   asyncParallel.itemComplete();
                                               });
                                               for (var i = 0; i < user.followers.length; i++) {
                                                   User.findOne({username: user.followers[i]}, function (err, user) {
                                                       if (err || !user) {
                                                           console.log(err);
                                                           randomMeepo4.itemComplete();
                                                       }
                                                       else if (user) {
                                                           var notify = new Notification();
                                                           notify.type = 'followingBattleStarted';
                                                           notify.idOwner = user._id;
                                                           notify.idUser = battleUser._id;
                                                           notify.viewed = false;
                                                           notify.itemId = battle._id;
                                                           notify.date = now;
                                                           notify.save(function (err) {
                                                               if(err){
                                                                   console.log(err);
                                                               }
                                                               console.log('Notification is CREATED');
                                                               randomMeepo4.itemComplete();
                                                               //res.send(notify);
                                                           });
                                                       }
                                                   });
                                               }
                                           }
                                       });
                                   });
                                   console.log(err);
                               }
                               //
                               //  if free random battles not found then create Battle and start to wait
                               //
                               if (!battles.length) {
                                   createBattle(battleForm, photo, req.user);
                               }
                           });
                       }

                       //
                       //  friend battle type
                       //
                       else {
                           User.findOne({username: photo.type}, function (err, user) {
                               if (err || !user) {
                                   console.log('parse id2 to createBattle()');
                                   res.send(400);
                               }
                               if (user) {
                                   var meepo = new Meepo();
                                   //
                                   //  creating Brands
                                   //
                                   if (battleForm.brands) {
                                       if (battleForm.brands.length) {
                                           meepo.push(undefined, battleForm.brands.length);
                                           for (var i = 0; i < battleForm.brands.length; i++) {
                                               (function (i) {
                                                   var counter = i;
                                                   Brand.findOne({name: battleForm.brands[counter].value}, function (err, brand) {
                                                       if (err) {
                                                           return res.send(err);
                                                       }
                                                       if (!brand) {
                                                           var brand = new Brand();
                                                           brand.name = battleForm.brands[counter].value;
                                                       }
                                                       brand.photosId.push(photo.id);
                                                       brand.save(function (err) {
                                                           if (err){
                                                               console.error(err);
                                                               return meepo.itemComplete();
                                                           }
                                                           photo.brands.push({
                                                               position: battleForm.brands[counter].position,
                                                               brandId: brand._id
                                                           });
                                                           photo.save(function (err) {
                                                               if (err) {
                                                                   console.error(err);
                                                                   return meepo.itemComplete();
                                                               }
                                                               meepo.itemComplete();
                                                           });

                                                       })
                                                   });
                                               })(i);
                                           }
                                       }
                                   }
                                   meepo.callback(function () {
                                       //
                                       //  after creating Brands run createBattle
                                       //
                                       createBattle(battleForm, photo, req.user, user);
                                   });
                               }
                           });
                       }
                   });
               }
            });

        }
        var createBattle = function (bform, newPhoto, user1, user2) {
            var battle = new Battle();
            battle.winner = '';
            battle.id1 = '';
            battle.id2 = '';
            battle.type = bform.type;
            battle.id1 = user1._id;
            if (user2) {
                battle.id2 = user2._id;
            }
            battle.idPhoto1 = newPhoto.id;
            battle.category = bform.cat;
            battle.save(function (err) {
                if (err) return res.send(err);
                //
                //  check if type is not random
                //
                if (battle.type == 'random') {
                    //
                    //  free random battle created, please wait for an opponent
                    //
                    res.send(200);
                }
                else {
                    sendNotify(user1, user2, battle._id);
                }
            });
        }

        //
        //  create notify to user2
        //
        var sendNotify = function (userInvite, userAccept, battleId) {
            if (!userInvite || !userAccept || !battleId) {
                console.log('some of fields is not set');
                return res.sendStatus(500);
            }
            var notify = new Notification();
            notify.type = 'request';
            notify.idOwner = userAccept._id;
            notify.idUser = userInvite._id;
            notify.date = new Date();
            notify.viewed = false;
            notify.itemId = battleId;

            notify.save(function () {
                console.log('Notification is CREATED');
                res.send(notify);
            });
        }

        //
        // check if user1 alredy have non-active uploaded photos
        //
        // Photo.findOne({
        //     ownerId: req.user._id,
        //     isFinished: false
        //  }, function(err, photo){
        //     console.log('I am finding photos:');
        //     console.log(photo);
        //     if(err) console.log('1' + err);
        //     if(photo.length){
        //         console.log('photo');
        //         console.log(photo);
        //         return res.send(photo);
        //     }
        //     if(!photo.length){
        //         console.log('continue');
        //         continueFunction();
        //     }
        // });

        //
        //  simplify battle (without limiting non-active battles)
        //
        continueFunction();
    });


    //photo
    //router.put('/battles', auth, function (req, res) {
    //    if (req.query.id1 || req.body.battleForm) return res.sendStatus(400);
    //    var battleForm = req.body.battleForm;
    //    var id1 = req.query.id1;
    //    var photo = new Photo();
    //    photo.name = req.body.photo;
    //    photo.ownerId = req.user._id;
    //    photo.isFinished = false;
    //    photo.startDate = new Date();
    //    if (battleForm.price)
    //        photo.price = battleForm.price;
    //    if (battleForm.type)
    //        photo.type = battleForm.type;
    //    if (battleForm.comment)
    //        photo.comment = battleForm.comment;
    //    if (battleForm.photo)
    //        photo.name = battleForm.photo;
    //
    //    photo.save(function (err) {
    //        Battle.findOne({id1: id1, winner: undefined}, function (err, battle) {
    //            if (err) {
    //                console.log(err);
    //                return res.send(err);
    //            }
    //            if (!battle) {
    //                return res.sendStatus(500);
    //            }
    //            if (battle) {
    //                battle.id2 = req.user._id;
    //                battle.idPhoto2 = photo._id;
    //                battle.date = new Date();
    //                battle.save(function (err) {
    //                    if (err) {
    //                        console.log(err);
    //                    }
    //                    res.sendStatus(200);
    //                    // todo # iffkomc send notifications for all followers of both users
    //                })
    //            }
    //        });
    //    });
    //});

}
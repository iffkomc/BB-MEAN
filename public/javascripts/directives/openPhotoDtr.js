/**********************************************************************
 * openPhotoDtr directive
 **********************************************************************/
'use strict';

angular.module('app')
    .directive('openPhotoDtr', ['$timeout', '$window', '$state', '$http', 'PhotoSvc', 'BattleSvc', 'CommentSvc', 'UserSvc', 'DataDiffSvc', function ($timeout, $window, $state, $http, PhotoSvc, BattleSvc, CommentSvc, UserSvc, DataDiffSvc) {
        return {
            templateUrl: 'views/popupOpenPhoto.html',
            controller: function ($scope) {
                $scope.isVoted = false;
                $scope.isFinished = false;
                $scope.battleStatus = false;
                var setBattleStatus = function (v1, v2) {
                    if(v2 != '' && v2){
                        v2 = true;
                    }
                    if (v1 || v2) {
                        $scope.battleStatus = true;
                    }
                    else {
                        $scope.battleStatus = false;
                    }
                }

                $scope.currentState = $state.current.name.toString().split('.')[0];
                var photoId = $state.params.photoId;
                $scope.photoTmp;
                $scope.photoTmp2;
                $scope.photo1;
                $scope.photo2;
                $scope.battle;
                $scope.views;
                $scope.likes;
                $scope.winner;
                $scope.replyTo;
                $scope.commentText;
                $scope.owner = {};

                //$scope.votePhoto = function () {
                //    $http.put('/battles?id=' + scope.battle._id + '&vote=' + voteTo).then(function (response) {
                //        var btl = response.data;
                //        scope.battle.rateIdsPhoto1 = btl.rateIdsPhoto1;
                //        scope.battle.rateIdsPhoto2 = btl.rateIdsPhoto2;
                //        scope.isVoted = true;
                //    }, function (err) {
                //        console.error(err);
                //    });
                //};

                $scope.loadUser = function (id, wherePut) {
                    if (id == 'mine') {
                        console.log(wherePut);
                        UserSvc.get('mine').then(function (response) {
                            console.error('this is mine');
                            console.log(response.data);
                            wherePut.user = response.data;
                            console.log(wherePut);
                            console.log($scope.owner);
                        }, function (err) {
                            console.error(err);
                        });
                    }
                    else {
                        UserSvc.get('id', id).then(function (response) {
                            console.log(response.data);
                            $scope.comments.forEach(function (item, index) {
                                if (item.userId == id) {
                                    wherePut.user = response.data;
                                    console.log(wherePut);
                                }
                            })
                        }, function (err) {
                            console.error(err);
                        });
                    }
                };
                $scope.setComment = function (replyTo, name) {
                    $scope.replyTo = replyTo;
                    $scope.commentText = name + ', ';
                }
                $scope.loadUser('mine', $scope.owner);
                $scope.likeComment = function (commentsArray, i) {
                    console.log(i);
                    var index = i;
                    console.log(commentsArray[index]);
                    return CommentSvc.put('id', commentsArray[index]._id).then(function (response) {
                        console.log(response.data);
                        response.data.user = commentsArray[index].user;
                        return commentsArray[index] = response.data;
                    }, function (err) {
                        console.error(err);
                    });
                };
                $scope.loadComments = function () {
                    CommentSvc.get('photoId', photoId).then(function (response) {
                        $scope.comments = response.data;
                        console.log($scope.comments);
                        $scope.comments.forEach(function (item, index) {
                            $scope.comments[index].ago = DataDiffSvc(new Date(item.date), new Date());
                            $scope.loadUser(item.userId, $scope.comments[index]);
                        });
                    }, function (err) {
                        console.error(err);
                    });
                }
                $scope.loadComments();

                $scope.newComment = function () {
                    //userId: comment.userId,
                    //    replyTo: comment.replyTo, // todo iffkomc # need to check if exist comment or not
                    //    text: comment.text,
                    //    date: new Date(),
                    //    likes: []
                    CommentSvc.post('photoId', photoId, {
                        comment: {
                            replyTo: $scope.replyTo,
                            text: $scope.commentText
                        }
                    }).then(function (response) {
                        console.error(response.data);
                        $scope.loadComments();
                        $scope.commentText = '';
                    }, function (err) {
                        console.error(err);
                    });
                }

                var async = new Meepo();
                async.push(undefined, 2);
                async.callback(function () {
                    setOpenPhotoData($scope.photoTmp, $scope.battle);
                    $scope.alignSlide();
                });
                PhotoSvc.get('id', photoId).then(function (response) {
                    $scope.photoTmp = response.data;
                    console.log(response.data);
                    async.itemComplete();
                }, function (err) {
                    async.itemComplete();
                    console.error(err);
                });
                BattleSvc.get('photoId', photoId).then(function (response) {
                    $scope.battle = response.data;
                    console.log(response.data);
                    if($scope.battle.winner != ''){
                        $scope.isFinished = true;
                        setBattleStatus($scope.isVoted, $scope.isFinished);
                    }
                    $scope.battle.rateIdsPhoto1.forEach(function (item, index) {
                        if (item == $scope.owner.user._id) {
                            $scope.isVoted = true;
                            setBattleStatus($scope.isVoted, $scope.isFinished);
                        }
                    });
                    $scope.battle.rateIdsPhoto2.forEach(function (item, index) {
                        if (item == $scope.owner.user._id) {
                            $scope.isVoted = true;
                            setBattleStatus($scope.isVoted, $scope.isFinished);
                        }
                    });

                    var req;
                    if ($scope.battle.idPhoto1 == $scope.photoTmp._id) {
                        PhotoSvc.get('id', $scope.battle.idPhoto2).then(function (response) {
                            console.log('photo2');
                            console.log(response.data);
                            $scope.photo1 = $scope.photoTmp;
                            $scope.photoTmp2 = $scope.photo2 = response.data;
                            async.itemComplete();
                        }, function (err) {
                            console.error(err);
                            async.itemComplete();
                        });
                    }
                    else if ($scope.battle.idPhoto2 == $scope.photoTmp._id) {
                        $scope.photo2 = $scope.photoTmp;
                        PhotoSvc.get('id', $scope.battle.idPhoto1).then(function (response) {
                            console.log('photo1');
                            console.log(response.data);
                            $scope.photoTmp2 = $scope.photo1 = response.data;
                            $scope.photo2 = $scope.photoTmp;
                            setOpenPhotoData($scope.photo2, $scope.battle);
                            async.itemComplete();
                        }, function (err) {
                            console.error(err);
                            async.itemComplete();
                        });
                    }
                }, function (err) {
                    console.error(err);
                });

                var setOpenPhotoData = function (photo, battle) {
                    // set likes
                    if (photo._id == $scope.battle.idPhoto1) {
                        $scope.likes = $scope.battle.rateIdsPhoto1.length;
                    }
                    else if (photo._id == battle.idPhoto2) {
                        $scope.likes = $scope.battle.rateIdsPhoto2.length;
                    }
                    // set winner
                    if (photo.ownerId == $scope.battle.winner) {
                        //alert($scope.battle.winner);
                        $scope.winner = 'Winner';
                    }
                    else if ($scope.battle.winner != '') {
                        $scope.winner = 'Lost';
                    }
                    else {
                        $scope.winner = '...';
                    }
                    // set views
                    if ($scope.photoTmp.viewsIds) {
                        $scope.views = $scope.photoTmp.viewsIds.length;
                    }
                    else {
                        $scope.views = 0;
                    }
                }
            },
            link: function (scope, elem) {
                angular.element($window).on('resize', function(){
                    $timeout(function(){
                        scope.alignSlide();
                    }, 100);
                });
                scope.alignSlide = function(){
                    if(scope.photoTmp && scope.photo1){
                        var containerWidth = angular.element('.openPhoto-box-body-body').width();
                        var slideList = angular.element('.burbl-slider');
                        var slide = angular.element('.burbl-slider-item img');
                        var offset;
                        var additionOffset = parseInt(slide.parent().css('padding-left'));
                        offset = ( containerWidth - slide.width() ) / 2 - additionOffset;
                        if(scope.photoTmp._id == scope.photo1._id){
                            //console.log(slideList);
                            //console.log(containerWidth);
                            //console.log(offset);
                            //slideList.hide();
                            slideList.css({left: offset+'px'});
                        }
                        else{
                            offset = ( offset - slide.parent().innerWidth() );

                            slideList.css({left: offset+'px'});
                        }
                    }
                }
                elem.click(function (e) {
                    if (!angular.element(e.target).closest('.openPhoto-box').length) {
                        scope.close();
                    }
                });
                scope.close = function () {
                    $state.go(scope.currentState);
                }
            }
        }
    }]);

var User = require('./../../models/user');

module.exports = function(router, passport, auth, nconf, mode) {

    // delete user
    // todo # iffkomc : ��������� ������ �������� ������ ��������� ������ ���� ����
    router.delete('/users/:username', auth, function (req, res) {
        User.findOneAndRemove({'username': req.params.username}, {}, function () {
            console.log('User successfuly deleted!');
            res.send(true);
        });
    });
}
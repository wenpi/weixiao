var Q = require("q");
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");
var request = require('request');

/*
 * 查询数据
 */
function queryByOpenId(opts){
    var userOpenId = opts.userOpenId || '-1';
    var schoolOpenId = opts.schoolOpenId || '-1';
    var sql = [
        "SELECT * FROM wex_user WHERE id IN (SELECT userid FROM wex_teacher WHERE open_id = '" + userOpenId +"')",
        "UNION",
        "SELECT * FROM wex_user WHERE wex_user.id IN (",
        "SELECT userid FROM wex_parent WHERE wex_parent.id IN (SELECT parent_id FROM wex_parent_student wps WHERE wps.school_open_id = '" + schoolOpenId + "' and wps.parent_open_id = '" + userOpenId + "'));"
    ];
    return MysqlServices.query(sql.join(" "));
    //return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};

/*
 * 返回含有openId的数据
 */
exports.queryByOpenId = function(opts) {
    var deferred = Q.defer();

    queryByOpenId(opts).then(function(users) {
        if (users && users.length === 1) {
            deferred.resolve(users[0]);
        } else {
            deferred.reject({status: 500, message: "该微信账号未认证。"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

function queryByMobile(mobile){
    return MysqlServices.query("select * from wex_user where 1=1 and mobile ='" + mobile + "'");
    //return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};

/*
 * 返回含有openId的数据
 */
exports.queryByMobile = function(mobile) {
    var deferred = Q.defer();

    queryByMobile(mobile).then(function(users) {
        if (users && users.length === 1) {
            deferred.resolve(users[0]);
        } else {
            deferred.reject({status: 500, message: "没有这个认证用户。"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}

/*
 * 查询家长子女
 */
exports.queryStudentsAsParent = function(opts){
    var userId = opts.userId || '-1';
    var schoolOpenId = opts.schoolOpenId || '-1';
    var sql = [
        "SELECT id, name FROM wex_student  WHERE id IN (SELECT student_id FROM wex_parent_student ",
            "WHERE school_open_id = '" + schoolOpenId + "' AND parent_id = (SELECT id FROM wex_parent WHERE userid = '" + userId + "' ));"
    ];
    return MysqlServices.query(sql.join(" "));
};
/**
 * 根据家长信息查出其他家长
 */
exports.queryParentsAsParent = function(opts){
    var userId = opts.userId || '-1';
    var schoolOpenId = opts.schoolOpenId || '-1';
    var sql = [
     "SELECT mobile, name from wex_parent_user where id in ",
      "(select parent_id FROM wex_parent_student where student_id ",
          "in (select student_id FROM wex_parent_student where school_open_id = '" + schoolOpenId + "' and ",
               "parent_id = (SELECT id FROM wex_parent WHERE userid = '" + userId + "' )));"
    ];
    return MysqlServices.query(sql.join(" "));
};

/*
 * 查询家长子女
 */
exports.queryStudentsAsParent = function(opts){
    var userId = opts.userId || '-1';
    var schoolOpenId = opts.schoolOpenId || '-1';
    var sql = [
        "SELECT id, name FROM wex_student  WHERE id IN (SELECT student_id FROM wex_parent_student ",
            "WHERE school_open_id = '" + schoolOpenId + "' AND parent_id = (SELECT id FROM wex_parent WHERE userid = '" + userId + "' ));"
    ];
    return MysqlServices.query(sql.join(" "));
};
/*
 * 查询老师学生
 */
exports.queryStudentsAsTeacher = function(opts){
    var userId = opts.userId || '-1';
    var sql = [
        "SELECT id, name FROM wex_student WHERE class_id IN  ",
            "(SELECT class_id FROM wex_class_teacher WHERE teacher_id IN (SELECT id FROM wex_teacher WHERE userid = '" + userId+ "'));"
    ];
    return MysqlServices.query(sql.join(" "));
};

/*
 * 更新profile image
 */
module.exports.updateProfileImage = function(user) {
    var deferred = Q.defer(),
        url = conf.site_root + '/user/mobileModifyPhoto';

    var data = {
        'userid': user.id,
        'profileImage': user.profileImage 
    };

    console.info(url);
    console.info(data);

    request.post(
        url,
        {
            form: data
        },
        function (error, response, body) {
            if (error) {
                //console.info(response.body)
                deferred.reject(error);
            }
            deferred.resolve();
        }
    );

    return deferred.promise;
};
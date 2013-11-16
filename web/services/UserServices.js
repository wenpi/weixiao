var Q = require("q");
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");

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
            deferred.reject({status: 500, message: "该微信账号未绑定幼儿园。"});
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
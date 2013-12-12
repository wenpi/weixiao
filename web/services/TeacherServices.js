var Q = require("q");
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");
var request = require('request');

/*
 * 查询数据
 */
function queryByUserId(opts){
    var userId = opts.userId || '-1';
    var sql = [
        "SELECT * FROM wex_teacher WHERE userid = '" + userId + "'"
    ];
    return MysqlServices.query(sql.join(" "));
    //return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};

/*
 * 返回含有userId的数据
 */
exports.queryByUserId = function(opts) {
    var deferred = Q.defer();

    queryByUserId(opts).then(function(teachers) {
        if (teachers && teachers.length === 1) {
            deferred.resolve(teachers[0]);
        } else {
            deferred.reject({status: 500, message: "无法获取老师信息"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}
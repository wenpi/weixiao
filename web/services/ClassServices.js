var Q = require("q");
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");
var request = require('request');

/*
 * 查询数据
 */
function queryBySchoolId(opts){
    var schoolId = opts.schoolId || '-1';
    var sql = [
        "SELECT * FROM wex_class WHERE school_id = '" + schoolId + "'"
    ];
    return MysqlServices.query(sql.join(" "));
    //return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};

/*
 * 返回含有schoolId的数据
 */
exports.queryBySchoolId = function(opts) {
    var deferred = Q.defer();

    queryBySchoolId(opts).then(function(classes) {
        if (classes && classes.length >= 0) {
            deferred.resolve(classes);
        } else {
            deferred.reject({status: 500, message: "无法获取班级信息"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}
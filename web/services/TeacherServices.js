var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 查询教师数据
 */
function query(schoolId, conditions){
    var extra = '?_t=1';
    for (var prop in conditions) {
        extra += '&' + prop + '=' + conditions[prop];
    }

    var url = conf.site_root + '/api/school/' + schoolId + '/teacher' + extra;
    return BaseServices.queryAll(url);
};
exports.query = query;
/*
 * 返回含有userId的数据
 */
exports.queryByUserId = function(data) {
    var deferred = Q.defer();

    query(data.schoolId, {userid: data.userId}).then(function(teachers) {
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

/*
 * 返回某个学生的老师数据
 */
exports.queryByStudentId = function(data) {
    var url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/teacher';
    return BaseServices.queryAll(url);
}
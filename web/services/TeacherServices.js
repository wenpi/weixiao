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
    var deferred = Q.defer(),
        url = conf.site_root + '/api/school/' + schoolId + '/teacher' + extra;

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var teachers = JSON.parse(body);
            deferred.resolve(teachers);
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
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
    var deferred = Q.defer(),
        url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/teacher';

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var teachers = JSON.parse(body);
            deferred.resolve(teachers);
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
}
var Q = require("q");
var conf = require("../conf");
var request = require('request');
var MysqlServices = require("./MysqlServices");
var BaseServices = require("./BaseServices");

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
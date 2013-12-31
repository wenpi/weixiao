var Q = require("q");
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");
var request = require('request');

/*
 * 查询数据
 */
function queryBySchoolId(opts){
    var schoolId = opts.schoolId || '-1';
    var deferred = Q.defer(),
        url = conf.site_root + '/api/school/' + schoolId + '/class';

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var classes = JSON.parse(body);
            deferred.resolve(classes);
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
};
exports.queryBySchoolId = queryBySchoolId;

/*
 * 查询数据
 */
function queryByTeacher(opts){
    var schoolId = opts.schoolId || '-1';
    var teacherId = opts.teacherId || '-1';
    var deferred = Q.defer(),
        url = conf.site_root + '/api/school/' + schoolId + '/teacher/' + teacherId + '/class';

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var classes = JSON.parse(body);
            deferred.resolve(classes);
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
};
exports.queryByTeacher = queryByTeacher;
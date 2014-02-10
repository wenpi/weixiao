var Q = require("q");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");

/*
 * 查询数据
 */
function queryBySchool(opts){
    var schoolId = opts.schoolId || '-1';
    var url = conf.site_root + '/api/school/' + schoolId + '/class';
    return BaseServices.queryAll(url);
};
exports.queryBySchool = queryBySchool;

/*
 * 查询数据
 */
function queryByTeacher(opts){
    var schoolId = opts.schoolId || '-1';
    var teacherId = opts.teacherId || '-1';
    var url = conf.site_root + '/api/school/' + schoolId + '/teacher/' + teacherId + '/class';

    return BaseServices.queryAll(url);
};
exports.queryByTeacher = queryByTeacher;
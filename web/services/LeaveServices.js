var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 查询某个学生的请假记录
 */
exports.queryLeavesByStudentId = function(data) {
	var url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/leave';
	return BaseServices.queryAll(url);
}

/*
 * 创建请假请求
 */
exports.addLeave = function(data) {
	var url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/leave';

	return BaseServices.create(url, {
        startDate: data.startDate,
        endDate: data.endDate,
        days: data.days,
        type: data.type,
        reason: data.reason,
        createdBy: data.createdBy
    });
}
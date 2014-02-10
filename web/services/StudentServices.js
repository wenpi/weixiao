var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 获得某个班学生集合
 */
exports.queryByClassId = function(data) {
	var url = conf.site_root + '/api/school/' + data.schoolId + '/class/' + data.classId + '/student';
	return BaseServices.queryAll(url);
}

/*
 * 获得家长的集合
 */
exports.queryByParentId = function(data) {
	var url = conf.site_root + '/api/school/' + data.schoolId + '/parent/' + data.parentId + '/student';
	return BaseServices.queryAll(url);
}
var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 查询家长数据
 */
function query(schoolId, conditions){
   var extra = '?_t=1';
   for (var prop in conditions) {
       extra += '&' + prop + '=' + conditions[prop];
   }

   var url = conf.site_root + '/api/school/' + schoolId + '/parent' + extra;
   return BaseServices.queryAll(url);
};
exports.query = query;

/*
 * 创建第N个家长
 */
exports.createParentByParent = function(data) {
	var url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/parent';
	return BaseServices.create(url, data);
}


/**
 * 根据家长信息查出其他家长
 */
exports.queryParentsByStudent = function(data){
	var url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/parent';
	return BaseServices.queryAll(url);
};
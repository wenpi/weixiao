var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 创建第N个家长
 */
exports.queryLeavesByStudentId = function(data) {
	var deferred = Q.defer(),
		url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/leave';

	var options = {
	    url: url,
	    method: 'GET',
	    headers: BaseServices.getAuthoriedHeader()
	};

	function callback(error, response, body) {
	    if (!error && response.statusCode == 200) {
	    	var leaves = JSON.parse(body);
	        deferred.resolve(leaves);
	    } else {
	    	deferred.reject();
	    }
	}

	request(options, callback);

	return deferred.promise;
}

/*
 * 创建请假请求
 */
exports.addLeave = function(data) {
	var deferred = Q.defer(),
		url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/leave';

	var options = {
	    url: url,
	    method: 'POST',
	    headers: BaseServices.getAuthoriedHeader(),
	    form: {
	    	startDate: data.startDate,
	    	endDate: data.endDate,
	    	days: data.days,
	    	type: data.type,
	    	reason: data.reason,
	    	createdBy: data.createdBy
	    }
	};

	function callback(error, response, body) {
	    if (!error && response.statusCode == 201) {
	        deferred.resolve();
	    } else {
	    	deferred.reject();
	    }
	}

	request(options, callback);

	return deferred.promise;
}
var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 创建第N个家长
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
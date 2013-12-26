var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 获得某个班学生集合
 */
exports.queryByClassId = function(data) {
	var deferred = Q.defer(),
		url = conf.site_root + '/api/school/' + data.schoolId + '/class/' + data.classId + '/student';

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
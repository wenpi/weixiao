var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 创建第N个家长
 */
exports.createParentByParent = function(data) {
	var deferred = Q.defer();

	var options = {
	    url: conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/parent',
	    method: 'POST',
	    headers: BaseServices.getAuthoriedHeader(),
	    form: data
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


/**
 * 根据家长信息查出其他家长
 */
exports.queryParentsByStudent = function(data){
	var deferred = Q.defer(),
		url = conf.site_root + '/api/school/' + data.schoolId + '/student/' + data.studentId + '/parent';

	var options = {
	    url: url,
	    method: 'GET',
	    headers: BaseServices.getAuthoriedHeader()
	};

	function callback(error, response, body) {
	    if (!error && response.statusCode == 200) {
	    	var parents = JSON.parse(body);
	        deferred.resolve(parents);
	    } else {
	    	deferred.reject();
	    }
	}

	request(options, callback);

	return deferred.promise;
};
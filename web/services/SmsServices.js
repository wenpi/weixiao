var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 发送邮件
 */
exports.sendSMS = function(data) {
	var deferred = Q.defer(),
		url = conf.site_root + '/api/sms';

	var options = {
	    url: url,
	    method: 'POST',
	    headers: BaseServices.getAuthoriedHeader(),
	    form: {
	    	mobile: data.mobile,
	    	content: data.content
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
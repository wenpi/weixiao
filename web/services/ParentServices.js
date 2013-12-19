var Q = require("q");
var request = require('request');
var conf = require("../conf");
var BaseServices = require("./BaseServices");

/*
 * 返回绑定的场所
 */
exports.queryByOpenId = function(openId) {
	var deferred = Q.defer();

	setTimeout(function() {
		if (openId == 'panwei') {
			deferred.resolve({name: 'panwei'});
		} else {
			deferred.reject(null);
		}
	}, 1000);

	return deferred.promise;
}

/*
 * 创建第N个家长
 */
exports.createParentByParent = function(data) {
	var deferred = Q.defer();

	var options = {
	    url: conf.site_root + '/api/parent',
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
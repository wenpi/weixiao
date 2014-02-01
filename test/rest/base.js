require('date-utils');
var request = require('request');
var crypto = require('crypto');
var dateStr = (new Date()).toFormat("YYYYMMDD");
var Q = require("q");

function getBasicToken(type) {
	var salt = 'rest' + 'kinderg' + '1qw23er4',
		shasum = crypto.createHash('md5');

	switch(type) {
	case "basic-none":
	token = {};
	break;

	case "basic-invalid":
	token = {"wexkey": "1234", "wextoken": "321"}
	break;

	case "basic-expired":
	var key = (new Date()).getTime() - 12 * 60 * 60 * 1000, token;
	shasum.update(key + salt + dateStr);
	token = {"wexkey": key, "wextoken": shasum.digest('hex')}
	break;

	case "basic-valid":
	var key = (new Date()).getTime(), token;
	shasum.update(key + salt + dateStr);
	token = {"wexkey": key, "wextoken": shasum.digest('hex')}
	break;
	}
	//console.info(token);
	return token;
}

var SERVER = "http://192.168.1.107";
module.exports.config = function() {
	return {
		SERVER: SERVER
	};
};
module.exports.queryPagingList = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getBasicToken(options.token)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata.result);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.queryAll = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getBasicToken(options.token)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.create = function(url, data, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'POST',
        headers: getBasicToken(options.token),
        form: data
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 201) {
        	var jsondata = JSON.parse(body);
            deferred.resolve(jsondata.message);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.get = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'GET',
        headers: getBasicToken(options.token)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsonitem = JSON.parse(body);
            deferred.resolve(jsonitem);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.update = function(url, data, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'POST',
        headers: getBasicToken(options.token),
        form: data
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
        	var jsondata = JSON.parse(body);
            deferred.resolve(jsondata.message);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
module.exports.remove = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basic-valid'};

    request({
        url: SERVER + url,
        method: 'DELETE',
        headers: getBasicToken(options.token)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve(true);
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    });

    return deferred.promise;
}
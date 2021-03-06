require('date-utils');

var Q = require("q");
var conf = require('../conf');
var crypto = require('crypto');
var request = require('request');

/**
 * get auth header
 */

function getToken(userId) {
    var shasum = crypto.createHash('md5');
    var key = (new Date()).getTime();
    
    if (!userId) {
        var today = Date.today();
        shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + today.toFormat('YYYYMMDD'));
    } else {
        shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + userId);
    }
    
    var token = {
        'wexkey': key,
        'wextoken': shasum.digest('hex'),
    }
    if (userId) {
        token.wexuser = userId;
    }
    return token;
}
exports.getAuthoriedHeader = getToken;

function getUserToken(userId) {
    var shasum = crypto.createHash('md5');
    var key = (new Date()).getTime();
    shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + userId);
    var token = shasum.digest('hex');
    return {
        'wexkey': key,
        'wextoken': token,
    }
}
/**
 * get auth params
 */
exports.getAuthoriedParams = function(schoolId, userId) {
	var token = getUserToken(userId);
	return [
		'wexschool=' + schoolId,
		'wexuser=' + userId,
		'wexkey=' + token.wexkey,
		'wextoken=' + token.wextoken
	].join("&");
}

/**
 * get paging list
 */
exports.queryPagingList = function(url) {
    var deferred = Q.defer();

    var options = {
        url: url,
        method: 'GET',
        headers: getToken()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            if (jsondata.result) {
                deferred.resolve(jsondata.result);
            } else {
                deferred.reject(new Error("result is missed"));
            }
        } else {
            deferred.reject(error || body || new Error("unknown"));
        }
    }

    request(options, callback);

    return deferred.promise;
}

/**
 * get full list
 */
exports.queryAll = function(url) {
    var deferred = Q.defer();

    var options = {
        url: url,
        method: 'GET',
        headers: getToken()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            if (jsondata) {
                deferred.resolve(jsondata);
            } else {
                deferred.resolve([]);
            }
        } else {
            deferred.reject(error || body || new Error("unknown"));
        }
    }

    request(options, callback);

    return deferred.promise;
}
/**
 * create object
 */
exports.create = function(url, record, userId) {
    var deferred = Q.defer();

    var options = {
        url: url,
        method: 'POST',
        headers: getToken(userId),
        form: record
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 201) {
            deferred.resolve();
        } else {
            deferred.reject(error || body || new Error('unkown'));
        }
    }

    request(options, callback);

    return deferred.promise;
}
/**
 * update object
 */
exports.update = function(url, record) {
    var deferred = Q.defer();
    
    var options = {
        url: url,
        method: 'POST',
        headers: getToken(),
        form: record
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            deferred.resolve();
        } else {
            deferred.reject(error || body || new Error('unknown'));
        }
    }
    
    request(options, callback);
    
    return deferred.promise;
}

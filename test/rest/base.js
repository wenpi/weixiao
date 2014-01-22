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
	return token;
}

module.exports.config = function() {
	return {
		SERVER: "http://test.weexiao.com"
	};
};
module.exports.queryPagingList = function(url, options) {
	var deferred = Q.defer(), options = options || {token: 'basci-valid'};

    request({
        url: url,
        method: 'GET',
        headers: getBasicToken(options.token)
    }, function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            deferred.resolve(jsondata.result);
        } else {
            deferred.reject(body);
        }
    });

    return deferred.promise;
}
require('date-utils');

var Q = require("q");
var conf = require('../conf');
var crypto = require('crypto');

/**
 * get auth header
 */

function getToken() {
    var today = Date.today();
    var shasum = crypto.createHash('md5');
    var key = (new Date()).getTime();
    shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + today.toFormat('YYYYMMDD'));
    var token = shasum.digest('hex');
    return {
        'wexkey': key,
        'wextoken': token,
    }
}
exports.getAuthoriedHeader = getToken;

/**
 * get auth params
 */
exports.getAuthoriedParams = function(schoolId, userId) {
	var token = getToken();
	return [
		'wexschool=' + schoolId,
		'wexuser=' + userId,
		'wexkey=' + token.wexkey,
		'wextoken=' + token.wextoken
	].join("&");
}
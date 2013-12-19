require('date-utils');

var Q = require("q");
var conf = require('../conf');
var crypto = require('crypto');

/**
 * get auth header
 */
exports.getAuthoriedHeader = function() {
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
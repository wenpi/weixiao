
var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20140122');
var token = shasum.digest('hex');

var options = {
    url: 'http://test.weexiao.com/api/user/2785cb79-be3a-42ec-8dce-0bdf66696efd/unread',
    method: 'GET',
    headers: {
        'wexkey': key,
        'wextoken': token,
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.info("done");
        console.log(body);
    } else {
        console.info("failed");
        console.log(body);
    }
}

request(options, callback);
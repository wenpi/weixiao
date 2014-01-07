
var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20140107');
var token = shasum.digest('hex');

var options = {
    url: 'http://test.weexiao.com/api/school/f9ac94e0-edb9-6985-0a2a-5b6dfac723b2',
    method: 'POST',
    headers: {
        'wexkey': key,
        'wextoken': token,
    },
    form: {
        openId: 'webot1'
    }
};

console.info(options);

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

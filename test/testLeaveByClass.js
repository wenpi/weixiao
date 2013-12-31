
var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20131231');
var token = shasum.digest('hex');

var options = {
    url: 'http://test.weexiao.com/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/class/4fe2adba-e60f-4276-9ff1-5d49a6269e81/leave',
    method: 'GET',
    headers: {
        'wexkey': key,
        'wextoken': token,
    }
};

console.info(options);

function callback(error, response, body) {
    if (!error && response.statusCode == 201) {
    	 console.info("done");
        console.log(body);
    } else {
    	console.info("failed");
    	console.log(body);
    }
}

request(options, callback);

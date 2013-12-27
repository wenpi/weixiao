
var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20131227');
var token = shasum.digest('hex');

var mobile = "138" + (new Date()).getTime().toString().substring(5);

var options = {
    url: 'http://test.weexiao.com/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/student/2653b8d5-f6f6-4b64-880d-3082bafa670a/parent',
    method: 'POST',
    headers: {
        'wexkey': key,
        'wextoken': token,
    },
    form: {
        name: "胡" + mobile,
        mobile: mobile,
        photo: "/upload/user/13811111111/profile/1387290854537_new",
        createdBy: "b43b7c56-5e45-11e3-83f9-00163e0426cb"
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

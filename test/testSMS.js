
var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20131224');
var token = shasum.digest('hex');

var options = {
    url: 'http://test.weexiao.com/api/sms',
    method: 'POST',
    headers: {
        'wexkey': key,
        'wextoken': token,
    },
    form: {
      mobile: '13811749917',
      content: "测试短信"
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 201) {
    	console.info("done");
      console.log(body);
    } else {
    	console.info("failed");
    	console.log(body);
    }
    console.info(body);
}

request(options, callback);

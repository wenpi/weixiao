
var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20140121');
var token = shasum.digest('hex');

var mobile = "138" + (new Date()).getTime().toString().substring(5);

var options = {
    url: 'http://test.weexiao.com/api/school/a106d68b-cbfd-294a-5324-8d0a5e329e2d/student/dcec1bd4-ea36-4622-89d6-6c1aeaefd434/message',
    method: 'POST',
    headers: {
        'wexkey': key,
        'wextoken': token,
    },
    form: {
        'Message[title]': "测试家长标题",
        'Message[content]:': "测试家长内容，测试推送",
        'Message[type]:': '0',
        'Message[top]:': '0',
        'userid': "fdf5dd6e-b461-42fa-a7ae-3a75718f347d"
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

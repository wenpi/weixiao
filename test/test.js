/*
webot send --des http://localhost:3000/weixin/api --token weexiao t hi

webot send --des http://kid.weexiao.com/webot/weixin/api --token weexiao e

https://wrapbootstrap.com/theme/detail-admin-responsive-theme-WB07061TJ

http://share.axure.com/IRVZPB/

npm install -g webot-cli

d28eefe9-db3b-4db5-a469-424ac5d187d8

/message/unreadcount

forever start -o out.log -e err.log app.js

weixiaohuodong
http://localhost:3000/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/syncmenu?appId=wx7e623947327e472e&appSecret=2964baf9c94a1417a54719294f241e0a
wuyi
http://localhost:3000/api/school/d28eefe9-db3b-4db5-a469-424ac5d187d8/syncmenu?appId=wxcf0e6547118dcf85&appSecret=94e7ff8e33e2c8b773e59c451042c542
lantian
http://localhost:3000/api/school/a106d68b-cbfd-294a-5324-8d0a5e329e2d/syncmenu?appId=wx104cf6959e8b0913&appSecret=91dd397bcabc742ced638ee11fe9405e
*/
//require("./wxbot")();

var request = require('request');
var crypto = require('crypto');
var shasum = crypto.createHash('md5');

var key = '1387432923256';
shasum.update(key + 'rest' + 'kinderg' + '1qw23er4' + '20131219');
var token = shasum.digest('hex');

var mobile = "138" + (new Date()).getTime().toString().substring(5);

var options = {
    url: 'http://test.weexiao.com/api/parent',
    method: 'POST',
    headers: {
        'wexkey': key,
        'wextoken': token,
    },
    form: {
    	schoolId: "d28eefe9-db3b-4db5-a469-424ac5d187d8",
    	studentId: "2b275c44-50fa-11e3-83f9-00163e0426cb",
    	name: "test" + mobile,
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

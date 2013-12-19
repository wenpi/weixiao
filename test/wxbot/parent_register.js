var assert = require("assert");
var request = require('request');

module.exports = function() {
	describe('test parent register', function(){
	});
	describe('test parent add by parent', function(done){

		var options = {
		    url: 'http://test.weexiao.com/webot/api/parent',
		    headers: {
		        'wexkey': 'request',
		        'wextoken': 'request'
		    }
		};

		function callback(error, response, body) {
		    if (!error && response.statusCode == 200) {
		        var info = JSON.parse(body);
		        console.log(info.stargazers_count + " Stars");
		        console.log(info.forks_count + " Forks");
		    } else {
		    	console.info("failed..");
		    }
		}

		request.post('http://test.weexiao.com/webot/api/parent', {form:{mobile: '13811749918'}}, function (error, response, body) {
			console.info)
            if (error) {
            	throw error;
            }
            done();
        })
	});
}
// webot send --des http://localhost:3000/weixin/api --token weexiao t 认证13811111111
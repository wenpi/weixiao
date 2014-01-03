var Q = require("q");
var BaseServices = require("./BaseServices");
var conf = require("../conf");
var request = require('request');
var BaseServices = require("./BaseServices");
//var collection = BaseServices.getCollection('wex_message');

/*
 * 查询消息数目
 */

/*
 * 插入消息 默认为老师提交,如果message含有studentId,则是家长提交
 */
module.exports.create = function(schoolId, user, message) {
    var deferred = Q.defer(),
    	url = conf.site_root + '/api/school/' + schoolId + '/teacher/' + user.teacherId + '/message',
    	data = {
    		'Message[title]': message.title || '',
    		'Message[content]:': message.content || '',
    		'Message[top]:': message.top || '0',
    		'userid': user.id,
    		'sendsms': message.sms || '0'
    	};

    if (message.studentId) {
    	url = conf.site_root + '/api/school/' + schoolId + '/student/' + message.studentId + '/message';
    }

	var options = {
	    url: url,
	    method: 'POST',
	    headers: BaseServices.getAuthoriedHeader(),
	    form: data
	};

	function callback(error, response, body) {
	    if (!error && response.statusCode == 201) {
	        deferred.resolve();
	    } else {
	    	deferred.reject();
	    }
	}

	request(options, callback);

	return deferred.promise;
}

module.exports.query = function(user) {
    var deferred = Q.defer(),
    	url = conf.site_root + '/index.php/message/unreadcount/' + md5(user.id);

    console.info(url);

	request.post(
	    url,
	    {
	    	form: {
	    		'userid': user.id,
	    		'usertype': user.type
	    	}
	    },
	    function (error, response, body) {
	    	console.info(response.body)
	        if (error) {
	        	console.info(response.body)
	        	deferred.reject(error);
	        }
	        try {
	        	var count = parseInt(JSON.parse(response.body).result.count) || 0;
	        	deferred.resolve(count);
	        } catch (e) {
	        	deferred.resolve(0);
	        }
	        
	    }
	);

	return deferred.promise;
}

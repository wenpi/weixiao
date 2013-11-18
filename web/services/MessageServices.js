var Q = require("q");
var BaseServices = require("./BaseServices");
var conf = require("../conf");
var request = require('request');
//var collection = BaseServices.getCollection('wex_message');

/*
 * 查询消息数目
 */

/*
 * 插入消息
 */
function md5(str){
    var hash = require('crypto').createHash('md5');
    return hash.update(str+"").digest('hex');
}
module.exports.create = function(user, message) {
    var deferred = Q.defer(),
    	url = conf.site_root + '/index.php/message/add/' + md5(user.id);

    console.info(url);
    console.info(message);

	request.post(
	    url,
	    {
	    	form: {
	    		'Message[title]': message.title || '',
	    		'Message[content]:': message.content || '',
	    		'Message[type]:': message.type || '0',
	    		'Message[top]:': message.top || '0',
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
	        deferred.resolve();
	    }
	);

	return deferred.promise;
}

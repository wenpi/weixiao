var Q = require("q");
var BaseServices = require("./BaseServices");
var conf = require("../conf");
var request = require('request');
//var collection = BaseServices.getCollection('wex_message');

/*
 * 查询消息数目
 */

/*
 * 插入图片
 */
module.exports.create = function(user, message) {
    var deferred = Q.defer(),
    	url = conf.site_root + '/classphoto/mobileSavePhoto';

    var data = {
		'title': message.title || '',
		'userid': user.id,
		'usertype': user.type
	};
	for (var i=0; i<message.photos.length; i++) {
		data['photos[' + i + ']'] = message.photos[i];
	}

    console.info(url);
    console.info(message);
	console.info(data);

	request.post(
	    url,
	    {
	    	form: data
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
};
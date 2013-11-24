var Q = require("q");
var BaseServices = require("./BaseServices");
var conf = require("../conf");
var request = require('request');
//var collection = BaseServices.getCollection('wex_record');

/*
 * 查询消息数目
 */

/*
 * 插入图片
 */
module.exports.create = function(user, record) {
    var deferred = Q.defer(),
    	url = conf.site_root + '/studentPath/mobileSaveStudentPath';

    var data = {
		'studentid': record.studentId,
		'contenttype': record.contenttype || '0',
		'content': record.content || '',
		'userid': user.id,
		'usertype': user.type
	};
	if (record.photos) {
		for (var i=0; i<record.photos.length; i++) {
			data['photos[' + i + ']'] = record.photos[i];
		}
	}

    console.info(url);
	console.info(data);

	request.post(
	    url,
	    {
	    	form: data
	    },
	    function (error, response, body) {
	    	console.info(response.body)
	        if (error) {
	        	//console.info(response.body)
	        	deferred.reject(error);
	        }
	        deferred.resolve();
	    }
	);

	return deferred.promise;
};
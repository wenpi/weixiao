var Q = require("q");
var monk = require('monk');
var conf = require('../conf');
var db = monk([
    conf.mongo.host + ':',
    conf.mongo.port + '/',
    conf.mongo.dbname
].join(""));

exports.getCollection = function(tbl) {
    return db.get(tbl);
};
/*
 * 查询列表
 */
exports.query = function(collection, conditions, addtions){
    var deferred = Q.defer();

    collection.find(conditions || {}, addtions || {}, function(e, docs){
    	if (e) {
    		deferred.reject(e);;
    	} else {
    		deferred.resolve(docs);
    	}
    });
	return deferred.promise;
};
/*
 * 创建新纪录
 */
exports.create = function(collection, obj){
    var deferred = Q.defer();

    if(obj._id) {
        deferred.reject({status:400, message: "400:ID is provided."});
    }

    collection.insert(obj, function (err, doc) {
        if (err) {
            deferred.reject(e);
        } else {
            deferred.resolve(doc);
        }
    });

	return deferred.promise;
};
/*
 * 根据_id获得纪录
 */
exports.get = function(collection, obj){
    var deferred = Q.defer();

    if(!obj._id) {
        deferred.reject({status:400, message: "400:ID is not provided."});
    }

    // Submit to the DB
    collection.find({_id: obj._id}, {}, function (err, docs) {
        if (err) {
            deferred.reject(e);
        } else {
            if (docs.length === 1) {
                deferred.resolve(docs[0]);
            } else if (docs.length === 0) {
                deferred.reject({status: 400, message: "Record is not found."});
            } else {
                deferred.reject({status: 500, message: "Record is not unqinued."});
            }
            
        }
    });

    return deferred.promise;
};
/*
 * 更新新纪录
 */
exports.update = function(collection, obj){
    var deferred = Q.defer();

    if(!obj._id) {
        deferred.reject({status:400, message: "400:ID is not provided."});
    }

    // Submit to the DB
    collection.updateById(obj._id, obj, function (err, effects) {
        if (err) {
            deferred.reject(e);
        } else {
            if (effects === 1) {
                deferred.resolve(obj);
            } else {
                deferred.reject("500:Only one record should be effected. now is " + effects);
            }
            
        }
    });

    return deferred.promise;
};
/*
 * 删除纪录
 */
exports.remove = function(collection, obj){
    var deferred = Q.defer();

    if(!obj._id) {
        deferred.reject({status:400, message: "400:ID is not provided."});
    }

    collection.remove({
        "_id" : obj._id
    }, function (err, removed) {
        if (!removed) {
            deferred.reject("500:it is not removed");
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
};
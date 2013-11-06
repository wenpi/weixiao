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
    		deferred.reject(e);
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
        deferred.reject({error: "ID is provided."});
    }

    collection.insert(obj, function (err, doc) {
        if (err) {
            deferred.reject(e);;
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
        deferred.reject({error: "ID is required."});
    }

    // Submit to the DB
    collection.find({_id: obj._id}, {}, function (err, docs) {
        if (err) {
            deferred.reject(err);
        } else {
            if (docs.length === 1) {
                deferred.resolve(docs[0]);
            } else if (docs.length === 0) {
                deferred.reject({"error": "_id is not found.", "status": 404});
            } else {
                deferred.reject({"error": "_id is not unqinued.", "status": 500});
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
        deferred.reject({error: "ID is required."});
    }

    // Submit to the DB
    collection.updateById(obj._id, obj, function (err, effects) {
        if (err) {
            deferred.reject(err);
        } else {
            if (effects === 1) {
                deferred.resolve();
            } else {
                deferred.reject(effects);
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
        deferred.reject({error: "ID is required."});
    }

    collection.remove({
        "_id" : obj._id
    }, function (err, removed) {
        if (!removed) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
};
var Q = require("q");
var BaseServices = require("./BaseServices");
var collection = BaseServices.getCollection('wex_palce');

/*
 * 查询菜单数据
 */
function query(conditions, addtions){
	return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};
exports.query = query;
/*
 * 插入菜单
 */
function create(obj){
	obj.createdTime = (new Date()).getTime();
	obj.enabled = false;
	return BaseServices.create(collection, obj);
};
exports.create = create;
/*
 * 获得记录
 */
function get(_id) {
	return BaseServices.get(collection, {_id: _id});
};
exports.get = get;
/*
 * 更新数据
 */
function update(obj) {
	return BaseServices.update(collection, obj);
};
exports.update = update;
/*
 * 更新数据
 */
function remove(_id) {
	return BaseServices.remove(collection, {_id: _id});
};
exports.remove = remove;
/*
 * 返回绑定的场所
 */
exports.getByWeixinId = function(weixinId) {
	var deferred = Q.defer();

    SchoolServices.query({weixinId: weixinId}, function(err, schools) {
	    if (err) {
	        deferred.reject(err);
	    }

	    if (schools.length === 1) {
	        deferred.resovle(schools[0]);
	    } else {
	    	deferred.reject({status: 500, message: "该微信账号未绑定幼儿园。"});
	    }
	});

	return deferred.promise;
}
/**
 * 和微信账号绑定
 */
exports.bind = function(_id, weixinId) {
    var deferred = Q.defer();

	if(!_id) {
        deferred.reject({status: 400, message: "激活标识未提供。"});
    }

	if(!weixinId) {
        deferred.reject({status: 400, message: "微信ID未提供。"});
    }

    query({weixinId: weixinId}).then(function(schools) {
    	if (schools.length > 0) {
    		throw new Error("该微信账号已经绑定幼儿园。");
    	} else {
    		return get(_id);
    	}
    })
	.then(function(school) {
		if (school && school.enabled === true) {
			throw new Error("该幼儿园已经绑定微信账号。");
		} else {
			school.weixinId = weixinId;
			school.enabled = true;
			return update(school);
		}
	}).then(function(school) {
		deferred.resolve(school);
	}).fail(function(err) {
		deferred.reject({status: 500, message: err.message});
	});

	return deferred.promise;
}
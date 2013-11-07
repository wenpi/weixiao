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
function remove(obj) {
	return BaseServices.remove(collection, obj);
};
exports.remove = remove;
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

    query({weixinId: weixinId}).then(function(places) {
    	if (places.length > 0) {
    		throw new Error("该微信账号已经绑定幼儿园。");
    	} else {
    		return get(_id);
    	}
    })
	.then(function(place) {
		if (place && place.enabled === true) {
			throw new Error("该幼儿园已经绑定微信账号。");
		} else {
			place.weixinId = weixinId;
			place.enabled = true;
			return update(place);
		}
	}).then(function(place) {
		deferred.resolve(place);
	}).fail(function(err) {
		deferred.reject({status: 500, message: err.message});
	});

	return deferred.promise;
}
var Q = require("q");
var BaseServices = require("./BaseServices");
var collection = BaseServices.getCollection('wex_parent');

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
exports.queryByOpenId = function(openId) {
	var deferred = Q.defer();

	setTimeout(function() {
		if (openId == 'panwei') {
			deferred.resolve({name: 'panwei'});
		} else {
			deferred.reject(null);
		}
	}, 1000);

	return deferred.promise;
}
var Q = require("q");
var BaseServices = require("./BaseServices");
var collection = BaseServices.getCollection('wex_message');

/*
 * 查询菜单数据
 */
function query(conditions, addtions){
	var deferred = Q.defer();

	//TODO invoke the php api
	setTimeout(function() {
		deferred.resolve([{}, {}]);
	}, 1000);

	return deferred.promise;
	//return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
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
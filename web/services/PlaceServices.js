var BaseServices = require("./BaseServices");
var collection = BaseServices.getCollection('wex_palce');

/*
 * 查询菜单数据
 */
exports.query = function(conditions, addtions){
	return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};
/*
 * 插入菜单
 */
exports.create = function(obj){
	obj.createdTime = (new Date()).getTime();
	obj.enabled = false;
	return BaseServices.create(collection, obj);
};
/*
 * 获得记录
 */
exports.get = function(_id){
	return BaseServices.get(collection, {_id: _id});
};
/*
 * 更新数据
 */
exports.update = function(obj){
	return BaseServices.update(collection, obj);
};
/*
 * 更新数据
 */
exports.remove = function(obj){
	return BaseServices.remove(collection, obj);
};
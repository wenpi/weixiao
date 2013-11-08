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
var Q = require("q");
var wechat = require('wechat');
var request = require('request');
var conf = require("../conf");
var MysqlServices = require("./MysqlServices");
var BaseServices = require("./BaseServices");

/*
 * 查询菜单数据
 */
/* for mongodb
function query(conditions, addtions){
    return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};
*/
// for mysql
function query(conditions){
    var extra = '';
    for (var prop in conditions) {
        var val = conditions[prop];
        if (prop === 'openId') {
            prop = 'open_id'
        }
        extra += 'and ' + prop + "='" + val + "'";
    }
    return MysqlServices.query("select * from wex_school where 1=1 " + extra);
    //return BaseServices.query(collection, conditions || null, addtions || {sort:[['createdTime', -1]]});
};
exports.query = query;

/*
 * 获得记录
 */
/* for mongodb
function get(_id) {
    return BaseServices.get(collection, {_id: _id});
};*/
function get(id) {
    return MysqlServices.get("select * from wex_school where id = '" + id + "'");
}
exports.get = get;
/*
 * 更新数据
 */
/* for mongodb
function update(obj) {
    return BaseServices.update(collection, obj);
};*/
// for mysql
function update(obj) {
    return MysqlServices.query("update wex_school set open_id = '" + obj.openId + "', enabled = 1 where id = '" + obj.id + "'");
};
exports.update = update;

/**
 * 和微信账号绑定
 */
exports.bind = function(_id, openId) {
    var deferred = Q.defer(), gbSchool;

    if(!_id) {
        deferred.reject({status: 400, message: "激活标识未提供。"});
    }

    if(!openId) {
        deferred.reject({status: 400, message: "微信ID未提供。"});
    }

    query({openId: openId}).then(function(schools) {
        if (schools.length > 0) {
            throw new Error("该微信账号已经绑定幼儿园。");
        } else {
            return get(_id);
        }
    })
    .then(function(school) {
        if (school && school.openId) {
            throw new Error("该幼儿园已经绑定微信账号。");
        } else {
            school.id = _id;
            school.openId = openId;
            school.enabled = 1;
            gbSchool = school;
            return update(school);
        }
    }).then(function() {
        deferred.resolve(gbSchool);
    }).fail(function(err) {
        deferred.reject({status: 500, message: err.message});
    });

    return deferred.promise;
}

/*
 * 返回绑定的场所
 */
exports.queryByOpenId = function(openId) {
    var deferred = Q.defer(),
        url = conf.site_root + '/api/school?openId=' + openId;

    var options = {
        url: url,
        method: 'GET',
        headers: BaseServices.getAuthoriedHeader()
    };

    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            var jsondata = JSON.parse(body);
            if (jsondata.result.length === 1) {
                deferred.resolve(jsondata.result[0]);
            } else {
                deferred.reject({status: 500, message: "该微信账号未绑定幼儿园。"});
            }
        } else {
            deferred.reject();
        }
    }

    request(options, callback);

    return deferred.promise;
}
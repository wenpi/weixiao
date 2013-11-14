var Q = require("q");
var BaseServices = require("./BaseServices");
var MysqlServices = require("./MysqlServices");
var collection = BaseServices.getCollection('wex_school');
var wechat = require('wechat');

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
/* for mongodb
function get(_id) {
    return BaseServices.get(collection, {_id: _id});
};*/
function get(id) {
    return MysqlServices.get("select * from wex_school where id = " + id);
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
    return MysqlServices.query("update wex_school set open_id = '" + obj.openId + "', enabled = 1 where id = " + obj.id);
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
exports.getByOpenId = function(openId) {
    var deferred = Q.defer();

    query({openId: openId}).then(function(schools) {
        if (schools && schools.length === 1) {
            deferred.resolve(schools[0]);
        } else {
            deferred.reject({status: 500, message: "该微信账号未绑定幼儿园。"});
        }
    }, function(err) {
        deferred.reject(err);
    });

    return deferred.promise;
}
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
        if (school && school.enabled === true) {
            throw new Error("该幼儿园已经绑定微信账号。");
        } else {
            school.id = _id;
            school.openId = openId;
            school.enabled = true;
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

/**
 * init the id
 */
function initMenu(schoolId) {
    return {
        "button":[{
            "name":"Home",
            "sub_button":[{  
                "type": "view",
                "name": "Intro",
                "url": "http://www.baidu.com?schoolId=" + schoolId
            }]
        }, {
            "name":"Class",
            "sub_button":[{  
                "type": "click",
                "name": "Message",
                "key": "PARENT_MESSAGE_INPUT"
            }, {
                "type": "click",
                "name": "My Message",
                "key":"PARENT_MESSAGE_CHECK"
            }, {
                "type": "click",
                "name": "Publish",
                "key":"PARENT_IMAGE_INPUT"
            }]
        }, {
            "name":"Profile",
            "sub_button":[{  
                "type":"click",
                "name":"Regsiter",
                "key":"PARENT_REGISTER"
            }, {
                "type":"view",
                "name":"Profile",
                "url": "http://www.baidu.com?schoolId=" + schoolId
            }]
        }]
    }
}
/**
 * Sync the menu to weixin
 */
exports.syncWeixinMenu = function(_id, configs) {
    var deferred = Q.defer();

    if (!configs.appId) {
        deferred.reject({error: 'app id is required.'});
    }
    if (!configs.appSecret) {
        deferred.reject({error: 'app secret is required.'});
    }

    var API = wechat.API;
    var api = new API(configs.appId, configs.appSecret);

    api.getAccessToken(function(err, result) {
        if (err) {
            return deferred.reject(err);
        }
        api.createMenu(initMenu(_id), function(err, result) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(result);
        });
    });

    return deferred.promise;
}
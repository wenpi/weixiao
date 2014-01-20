var Q = require("q");
var wechat = require('wechat');
var conf = require("../conf");


function initMenuBak(schoolId) {
    return {
        "button":[{
            "name":"本园生活",
            "sub_button":[{  
                "type": "view",
                "name": "全园播报",
                "url": conf.site_root +  "/front/notice/" + schoolId
            }, {  
                "type": "view",
                "name": "每周食谱",
                "url": conf.site_root +  "/front/dinner/" + schoolId
            }, {  
                "type": "view",
                "name": "关于本园",
                "url": conf.site_root + "/front/" + schoolId
            }]
        }, {
            "name":"班级互动",
            "sub_button":[{
                "type": "click",
                "name": "班级动态",
                "key":"CLASS_UPDATE"
            },/* {
                "type": "click",
                "name": "留言板",
                "key":"MESSAGE_VIEW"
            }, {
                "type": "click",
                "name": "班级相册",
                "key": "IMAGE_VIEW"
            }, */{  
                "type": "click",
                "name": "发布留言",
                "key": "MESSAGE_ADD"
            }, {
                "type": "click",
                "name": "发布照片",
                "key":"IMAGE_ADD"
            }, {  
                "type": "click",
                "name": "添加成长记录",
                "key": "KID_RECORD_ADD"
            }, {  
                "type": "click",
                "name": "我要请假",
                "key": "LEAVE_ADD"
            }/*, {
                "type": "click",
                "name": "听儿歌",
                "key": "CHILD_MUSIC"
            }*/]
        }, {
            "name":"个人中心",
            "sub_button":[ {  
                "type": "click",
                "name": "修改个人资料",
                "key": "PROFILE_EDIT"
            }, {
                "type": "click",
                "name": "修改密码",
                "key": "PASSWORD_EDIT"
            }, {
                "type": "click",
                "name": "添加家长",
                "key": "PARENT_ADD"
            }, {
                "type": "click",
                "name": "使用帮助",
                "key": "WEEXIAO_HELP"
            }]
        }]
    }
}

function initMenu() {
    return {
        "button":[{
            "name":"本园生活",
            "sub_button":[{
                "type": "click",
                "name": "全园播报",
                "key": "NOTICE"
            }, {
                "type": "click",
                "name": "每周食谱",
                "key": "DINNER"
            }, {
                "type": "click",
                "name": "关于本园",
                "key": "ABOUT"
            }, {
                "type": "click",
                "name": "使用帮助",
                "key": "HELP"
            }]
        }, {
            "type": "click",
            "name": "班级动态",
            "key":"CLASS_UPDATE"
        }, {
            "name":"家园互动",
            "sub_button":[{  
                "type": "click",
                "name": "发布留言",
                "key": "MESSAGE_ADD"
            }, {
                "type": "click",
                "name": "发布照片",
                "key":"IMAGE_ADD"
            }, {  
                "type": "click",
                "name": "添加成长记录",
                "key": "KID_RECORD_ADD"
            }, {  
                "type": "click",
                "name": "我要请假",
                "key": "LEAVE_ADD"
            }, {
                "type": "click",
                "name": "个人资料",
                "key": "PROFILE_GATEWAY"
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
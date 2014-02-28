/**
 * Usage:
 * -激活家长/老师
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var Q = require("q");
var conf = require('../../conf');
var UserServices = require("../../services/UserServices");
var utils = require("../utils");

module.exports = function(webot) {
    var failed = '认证失败，如未录入您的手机号，请联系幼儿园IT管理员。';
    var registered = '您已经是本园认证用户, 手机号为: <%- mobile%>，无需再次认证。';

    // 认证用户
    webot.set('user register start by text', {
        pattern: /^1(3|4|5|8)\d{9}$/i,
        handler: function(info, next) {
            var mobile = info.text;

            // 如果已经建立session, 则提示无需认证
            if (info.session.parent || info.session.teacher) {
                if (info.session.parent) { mobile = info.session.parent.mobile; }
                if (info.session.teacher) { mobile = info.session.teacher.mobile; }
                return next(null, ejs.render(
                    registered,
                    {mobile: mobile}
                ));
            }

            // 用手机号去用户表查询,如果获得结果,再用openId查询是否认证
            Q.all([
               UserServices.query({
                   schoolId: info.session.school.id,
                   mobile: mobile
               }),
               UserServices.query({
                    schoolId: info.session.school.id,
                    openId: info.uid
               })
            ]).then(function(results) {
                var users = results[0];
                // 判断该手机是否存在和是否激活
                if (users.length == 0) {
                    return next(null, ejs.render(
                       '手机号: <%- mobile%>，不存在。',
                        {mobile: mobile}
                    ));
                } else if (users.length > 1) {
                    return next(null, ejs.render(
                       '存在重复手机号: <%- mobile%>，请联系管理员。',
                        {mobile: mobile}
                    ));
                } else if (users.length === 1 && users[0].openId) {
                    return next(null, ejs.render(
                        '该手机号已经激活: <%- mobile%>，请联系管理员。',
                         {mobile: mobile}
                     ));
                }
                // 判断当前用户是否已经激活
                if (results[0].length > 0) {
                    return next(null, ejs.render(
                       '您已经通过认证。',
                        {mobile: mobile}
                    ));
                }
                // 提示用户可以继续
                var user = users[0],
                    type = user.type + '';

                // 不保存session.user,以免污染该namespace
                info.session.reguid = user.id;
                //info.session.mobile = mobile;
                info.session.type = type;
                info.wait("user register password type");
                return next(null, '请输入您的初始化密码：');
            });
            /*
            .then(function(user) {
                if (user) {
                    var usertype = user.type + '';
                    var prompt = "请上传孩子照片作为头像图片：";
                    if (usertype === '1') {
                        prompt = '请上传一张您的个人照片作为头像：';
                    }
                    // 如果查到相关信息,则是已经认证,否则需要继续认证流程
                    UserServices.queryByOpenId({
                        schoolId: info.session.school.id,
                        openId: info.uid
                    }).then(function(user) {
                        var text = ejs.render(
                            registered,
                            {mobile: user.mobile}
                        );
                        return next(null, text);
                    }, function(err) {
                        info.session.mobile = mobile;
                        info.wait("user register profile image");
                        return next(null, prompt);
                    });
                } else {
                    return next(null, failed);
                }
            }, function() {
                return next(null, failed);
            });*/
        }
    });

    webot.waitRule('user register password type', function(info, next) {
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("user register password type");
            return next(null, "请输入初始密码：");
        } else {
            info.session.password = info.text;
            var type = info.session.type;
            info.wait("user register profile image");
            if (type === '1') {
                return next(null, '请上传一张您的个人照片作为头像：');
            } else (type === '0') {
                return next(null, '请上传孩子照片作为头像图片：');
            }
        }
    });

    webot.waitRule('user register profile image', function(info, next) {
        if (!info.is("image")) {
            utils.operation_is_failed(info, next);
            info.rewait("user register profile image");
            return next(null, "抱歉，只能上传图片。");
        } else {
            var filename = '/school/' + info.session.school.id + '/user/' + info.session.reguid + '/profile';
            utils.download_image(info.param.picUrl, filename, function() {
                UserServices.update(info.session.school.id, info.session.reguid, {
                    photo: filename,
                    open_id: info.session.uid
                }).then(function() {
                    delete info.session.reguid;
                    delete info.session.type;
                    delete info.session.password;
                }, function(err) {
                    return next(null, "激活失败，请联系管理员。");
                });
            });
            /*
            var mobile = info.session.mobile;
            UserServices.queryByMobile(mobile).then(function(user) {
                if (user) {
                    // 如果查到相关信息,则是已经认证,否则需要保存头像并返回激活链接
                    UserServices.queryByOpenId({
                        schoolId: info.session.school.id,
                        openId: info.uid
                    }).then(function(user) {
                        var text = ejs.render(
                            registered,
                            {mobile: user.mobile}
                        );
                        return next(null, text);
                    }, function(err) {
                        var filename = 'user/' + mobile + '/profile/' + (new Date()).getTime();
                        utils.download_image(info.param.picUrl, filename, function() {
                            delete info.session.mobile;
                            var text = ejs.render(
                                '请点击<a href="<%- url%>">认证链接</a>完成用户认证操作。', 
                                {url: conf.site_root + '/user/mobileRegister?mobile=' + mobile + '&openId=' + info.uid + '&profileImage=' + filename}
                            );
                            return next(null, text);
                        });
                    });
                } else {
                    return next(null, failed);
                }*/
            }, function() {
                return next(null, failed);
            });
        }
    });
}
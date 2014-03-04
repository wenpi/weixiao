/**
 * 提交成长记录
 */
var ejs = require('ejs');
var conf = require('../../conf');
var wxconst = require("../const");
var utils = require("../utils");
var BaseServices = require("../../services/BaseServices");
var PathServices = require("../../services/PathServices");

module.exports = function(webot) {
    function add_path_start(info, next) {
        if (info.session.parent) {
            info.wait("kid path select type");
            return next(null, ejs.render(
                '使用网页版添加\n请<a href="<%- url%>">点击这里</a>\n\n使用微信对话框添加\n请回复数字：\n【1】发布文字记录\n【2】发布图文记录', 
                {
                    url: conf.site_root + '/webot/wap/index.html?' + 
                            BaseServices.getAuthoriedParams(info.session.school.id, info.session.parent.id) +
                            '#/student/' + info.session.parent.students[0].id + '/path'
                }
            ));
        } else if (info.session.teacher) {
            var classId = info.session.teacher.wexClasses[0].id;
            var route = '#/class/' + classId + '/leave';

            return next(null, ejs.render(
                '请<a href="<%- url%>">点击这里</a>使用网页版添加', 
                {
                    url: conf.site_root + '/webot/wap/index.html?' + 
                            BaseServices.getAuthoriedParams(info.session.school.id, info.session.teacher.id) +
                            route
                }
            ));
        } else {
            return next(null, "抱歉，您不是认证用户，不能发布成长记录！");
        }
    }
    // 等待主题输入
    webot.waitRule('kid path select type', function(info, next) {
        if (info.is("event")) {
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("kid path image text");
            return next(null, "抱歉，只能输入文字。");
        }

        if (!/^(1|2)$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("kid path select type");
            return next(null, "抱歉，只能输入数字1或者2。");
        }

        var user = info.session.parent;
        switch(info.text + '') {
        case "1":
            info.session.parent.path = {content: [], photos: [], type: 'text'};
            info.wait("kid path input text");
            return next(null, "通过这里输入的文字记录仅有您和本班老师可见。\n\n请输入文字：");
        break;
        case "2":
            info.wait("kid path image text");
            info.session.parent.path = {content: [], photos: [], type: 'image'};
            return next(null, "通过这里上传的图片记录仅您和本班老师可见。\n\n上传照片前，请先输入主题文字，简单描述一下您要发布的照片内容。例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等。\n\n请输入主题：");
        default:
            return next(null, "未知选项，操作终止。");
        }
    });

    // 等待文字记录输入
    webot.waitRule('kid path input text', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.path;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("kid path input text");
            return next(null, "抱歉，只能输入文字。");
        }
        // 接受提交指令
        if (info.text === wxconst.YES) {
            if (info.session.parent.path.content.length == 0) {
                utils.operation_is_failed(info, next);
                info.rewait("kid path input text");
                return next(null, "您还没输入文字，请输入文字：");
            }
            // 记录入库
            PathServices.create(info.session.school.id, info.session.parent.students[0].id, {
                content: info.session.parent.path.content.join(" "),
                createdBy: info.session.parent.id
            }).then(function() {
                delete info.session.parent.path;

                var route = '#/student/' + info.session.parent.students[0].id + '/path';

                next(null, ejs.render(
                    '发布成功，请<a href="<%- url%>">点击这里</a>查看', 
                    {
                        url: conf.site_root + '/webot/wap/index.html?' + 
                                BaseServices.getAuthoriedParams(info.session.school.id, info.session.parent.id) +
                                route
                    }
                ));
            }, function(err) {
                delete info.session.parent.path;
                next(null, "抱歉，服务器异常，无法发布成长记录。");
            });
        } else if (info.text === wxconst.NO) {
            delete info.session.parent.path;
            return next(null, "操作已取消。");
        } else {
            info.session.parent.path.content.push(info.text);
            info.wait("kid path input text");
            return next(null, "已存成草稿，您可继续输入文字。\n\n回复【" + wxconst.YES + "】提交\n回复【" + wxconst.NO + "】取消");
        }
    });
 
    // 等待图片记录的主题输入
    webot.waitRule('kid path image text', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.path;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("kid path image text");
            return next(null, "抱歉，只能输入文字。");
        }
        // 构造image
        info.session.parent.path.content.push(info.text);
        info.wait("kid path image upload");
        return next(null, "请选择您要上传的图片（最多9张）：");
    });

    // 等待图片记录
    webot.waitRule('kid path image upload', function(info, next) {
        if (info.is("event")) {
            delete info.session.parent.path;
            return next();
        }
        // 接受提交指令
        if (info.is("text")) {
            if (info.text === wxconst.YES) {

                if (info.session.parent.path.photos.length == 0) {
                    utils.operation_is_failed(info, next);
                    info.rewait("kid path image upload");
                    return next(null, "您还没上传图片，请上传：");
                }
                
                // 图片入库
                var time = (new Date()).getTime(), map = {}, photos = [];
                for (var i=0; i<info.session.parent.path.photos.length; i++) {
                    var filename = '/school/' +  info.session.school.id + '/user/' + info.session.parent.id + '/photo/' + (new Date()).getTime() + '/' + i;

                    if (map[info.session.parent.path.photos[i]]) { continue; }

                    map[info.session.parent.path.photos[i]] = filename;
                    photos.push(filename);
                    utils.download_image(info.session.parent.path.photos[i], filename);
                }

                // 记录入库
                PathServices.create(info.session.school.id, info.session.parent.students[0].id, {
                    content: info.session.parent.path.content.join(" "),
                    photos: photos,
                    createdBy: info.session.parent.id
                }).then(function() {
                    delete info.session.parent.path;

                    var route = '#/student/' + info.session.parent.students[0].id + '/path';

                    next(null, ejs.render(
                        '发布成功!\n<a href="<%- url%>">点击这里</a>查看。',
                        {
                            url: conf.site_root + '/webot/wap/index.html?' + 
                                    BaseServices.getAuthoriedParams(info.session.school.id, info.session.parent.id) +
                                    route
                        }
                    ));
                }, function() {
                    delete info.session.parent.path;
                    next(null, "抱歉，服务器异常，无法发布成长记录。");
                });
            } else if (info.text === wxconst.NO) {
                delete info.session.parent.path;
                return next(null, "操作已取消。");
            } else {
                return next(null, "只能回复【" + wxconst.YES + "】或【" + wxconst.NO + "】,也可以继续上传图片。");
            }
        } else if (info.is("image")) {
            if (info.session.path.photos.length == 9) {
                info.rewait("kid path image upload");
                return next(null, "已经上传9张图片！\n回复【" + wxconst.YES + "】发布\n回复【" + wxconst.NO + "】取消。");
            }
            // 构造image
            if (info.session.parent.path) {
                info.session.parent.path.photos.push(info.param.picUrl);
            }
            info.wait("kid path image upload");
            var len = info.session.parent.path.photos.length;
            return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n\n回复【" + wxconst.YES + "】发布\n回复【" + wxconst.NO + "】取消");
        } else {
            utils.operation_is_failed(info, next);
            info.wait("kid path image upload");
            return next(null, "只能回复【" + wxconst.YES + "】或者【" + wxconst.NO + "】，或者上传图片。");
        }
    });

    function view_path(info, next) {
        var user = info.session.parent || info.session.teacher;
        if (!user) {
            return next(null, "抱歉，您不是认证用户！");
        }
        var classId = studentId = route = '';
        if (info.session.parent) {
            studentId = info.session.parent.students[0].id;
            route = '#/student/' + studentId + '/path';
        } else if (info.session.teacher) {
            classId = info.session.teacher.wexClasses[0].id;
            route = '#/class/' + classId + '/path';
        }
        return next(null, ejs.render(
            '请<a href="<%- url%>">点击这里</a>查看', 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                        BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                        route
            }
        ));
    }

    // 发布图片提示语
    webot.set('user path add start by text', {
        domain: "gateway",
        pattern: /^发布成长记录/i,
        handler: add_path_start
    });
    webot.set('user path add start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'KID_RECORD_ADD';
        },
        handler: add_path_start
    });

    // 查看图片
    webot.set('user path view start by text', {
        domain: "gateway",
        pattern: /^(成长记录|查看成长记录|我的成长记录)/i,
        handler: view_path
    });
    webot.set('user path view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'KID_RECORD_VIEW';
        },
        handler: view_path
    });
}
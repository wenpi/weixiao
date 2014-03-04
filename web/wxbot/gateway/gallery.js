/**
 * 提交成长
 */
var ejs = require('ejs');
var conf = require('../../conf');
var wxconst = require("../const");
var utils = require("../utils");
var BaseServices = require("../../services/BaseServices");
var GalleryServices = require("../../services/GalleryServices");

module.exports = function(webot) {
    function add_gallery_start(info, next) {
        var user = info.session.parent || info.session.teacher;
        if (!user) {
            return next(null, "抱歉，您不是认证用户！");
        }

        info.wait("kid gallery select type");

        var classId = '';
        if (info.session.parent) {
            classId = info.session.parent.students[0].classId;
        } else if (info.session.teacher) {
            classId = info.session.teacher.wexClasses[0].id;
        }

        return next(null, ejs.render(
            ["分享孩子成长点滴到班级圈，仅供本班所有家长及老师访问。",
             '使用网页版分享\n请<a href="<%- url%>">点击这里</a>',
             "使用微信对话框分享\n请回复数字：\n【1】分享文字\n【2】分享图文"].join("\n\n"), 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                    BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                    '#/class/' + classId + '/gallery'
            }
        ));
    }
    // 等待主题输入
    webot.waitRule('kid gallery select type', function(info, next) {
        if (info.is("event")) {
            return next();
        }

        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("kid gallery image text");
            return next(null, "抱歉，只能输入文字。");
        }

        if (!/^(1|2)$/i.test(info.text)) {
            utils.operation_is_failed(info, next);
            info.rewait("kid gallery select type");
            return next(null, "抱歉，只能输入数字1或者2。");
        }

        var user = info.session.parent;
        switch(info.text + '') {
        case "1":
            info.session.gallery = {title: [], photos: [], type: 'text'};
            info.wait("kid gallery input text");
            return next(null, "通过这里输入的文字本班所有家长和老师可见。\n\n请输入文字：");
        break;
        case "2":
            info.wait("kid gallery image text");
            info.session.gallery = {title: [], photos: [], type: 'image'};
            return next(null, "通过这里上传的图文本班所有家长和老师可见。\n\n上传照片前，请先输入主题文字，简单描述一下您要分享的照片内容。例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等。\n\n请输入主题：");
        default:
            return next(null, "未知选项，操作终止。");
        }
    });

    // 等待文字输入
    webot.waitRule('kid gallery input text', function(info, next) {
        if (info.is("event")) {
            delete info.session.gallery;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("kid gallery input text");
            return next(null, "抱歉，只能输入文字。");
        }
        // 接受提交指令
        if (info.text === wxconst.YES) {
            if (info.session.gallery.title.length == 0) {
                utils.operation_is_failed(info, next);
                info.rewait("kid gallery input text");
                return next(null, "您还没输入文字，请输入文字：");
            }
            

            var derfer = '', classId = '';
            var user = info.session.parent || info.session.teacher;

            // 创建者
            info.session.gallery.createdBy = user.id;

            delete info.session.gallery.photos;
            info.session.gallery.title = info.session.gallery.title.join(" ");
 
            if (info.session.parent) {
                derfer = GalleryServices.createAsParent(info.session.school.id, info.session.parent.students[0].id, info.session.gallery);
                classId = info.session.parent.students[0].classId;
            } else if (info.session.teacher) {
                derfer = GalleryServices.createAsTeacher(info.session.school.id, info.session.teacher.wexClasses[0].id, info.session.gallery);
                classId = info.session.teacher.wexClasses[0].id;
            }

            derfer.then(function() {
                delete info.session.gallery;

                return next(null, ejs.render(
                    '分享成功!\n<a href="<%- url%>">点击这里</a>查看。',
                    {
                        url: conf.site_root + '/webot/wap/index.html?' + 
                                BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                                '#/class/' + classId + '/gallery'
                    }
                ));
            }, function(err) {
                delete info.session.gallery;
                next(null, "抱歉，服务器异常，无法提交。");
            });
        } else if (info.text === wxconst.NO) {
            delete info.session.gallery;
            return next(null, "操作已取消。");
        } else {
            info.session.gallery.title.push(info.text);
            info.wait("kid gallery input text");
            return next(null, "已存成草稿，您可继续输入文字。\n\n回复【" + wxconst.YES + "】提交\n回复【" + wxconst.NO + "】取消");
        }
    });
 
    // 等待图片的主题输入
    webot.waitRule('kid gallery image text', function(info, next) {
        if (info.is("event")) {
            delete info.session.gallery;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("kid gallery image text");
            return next(null, "抱歉，只能输入文字。");
        }
        // 构造image
        info.session.gallery.title.push(info.text);
        info.wait("kid gallery image upload");
        return next(null, "请选择您要上传的图片（最多9张）：");
    });

    // 等待图片
    webot.waitRule('kid gallery image upload', function(info, next) {
        if (info.is("event")) {
            delete info.session.gallery;
            return next();
        }
        var user = info.session.parent || info.session.teacher;

        // 接受提交指令
        if (info.is("text")) {
            if (info.text === wxconst.YES) {

                if (info.session.gallery.photos.length == 0) {
                    utils.operation_is_failed(info, next);
                    info.rewait("kid gallery image upload");
                    return next(null, "您还没上传图片，请上传：");
                }

                // 图片入库
                var time = (new Date()).getTime(), map = {}, photos = [];
                for (var i=0; i<info.session.gallery.photos.length; i++) {
                    var filename = '/school/' +  info.session.school.id + '/user/' + user.id + '/photo/' + (new Date()).getTime() + '/' + i;

                    if (map[info.session.gallery.photos[i]]) { continue; }

                    map[info.session.gallery.photos[i]] = filename;
                    photos.push(filename);
                    utils.download_image(info.session.gallery.photos[i], filename);
                }
                info.session.gallery.photos = photos;
 
                var derfer = '', classId = '';

                // 创建者
                info.session.gallery.title = info.session.gallery.title.join(" ");
                info.session.gallery.createdBy = user.id;

                if (info.session.parent) {
                    derfer = GalleryServices.createAsParent(info.session.school.id, info.session.parent.students[0].id, info.session.gallery);
                    classId = info.session.parent.students[0].classId;
                } else if (info.session.teacher) {
                    derfer = GalleryServices.createAsTeacher(info.session.school.id, info.session.teacher.wexClasses[0].id, info.session.gallery);
                    classId = info.session.teacher.wexClasses[0].id;
                }

                derfer.then(function() {
                    delete info.session.gallery;

                    return next(null, ejs.render(
                        '分享成功!\n<a href="<%- url%>">点击这里</a>查看。',
                        {
                            url: conf.site_root + '/webot/wap/index.html?' + 
                                    BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                                    '#/class/' + classId + '/gallery'
                        }
                    ));
                }, function(err) {
                    delete info.session.gallery;
                    next(null, "抱歉，服务器异常，无法提交。");
                });
            } else if (info.text === wxconst.NO) {
                delete info.session.gallery;
                return next(null, "操作已取消。");
            } else {
                return next(null, "只能回复【" + wxconst.YES + "】或【" + wxconst.NO + "】,也可以继续上传图片。");
            }
        } else if (info.is("image")) {
            if (info.session.gallery.photos.length == 9) {
                info.rewait("kid gallery image upload");
                return next(null, "已经上传9张图片！\n回复【" + wxconst.YES + "】分享\n回复【" + wxconst.NO + "】取消。");
            }
            // 构造image
            if (info.session.gallery) {
                info.session.gallery.photos.push(info.param.picUrl);
            }
            info.wait("kid gallery image upload");
            var len = info.session.gallery.photos.length;
            return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n\n回复【" + wxconst.YES + "】分享\n回复【" + wxconst.NO + "】取消");
        } else {
            utils.operation_is_failed(info, next);
            info.wait("kid gallery image upload");
            return next(null, "只能回复【" + wxconst.YES + "】或者【" + wxconst.NO + "】，或者上传图片。");
        }
    });

    function view_gallery(info, next) {
        var user = info.session.parent || info.session.teacher;
        if (!user) {
            return next(null, "抱歉，您不是认证用户！");
        }
        var classId = '';
        if (info.session.parent) {
            classId = info.session.parent.students[0].classId;
        } else if (info.session.teacher) {
            classId = info.session.teacher.wexClasses[0].id;
        }
        return next(null, ejs.render(
            '请<a href="<%- url%>">点击这里</a>查看', 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                        BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                        '#/class/' + classId + '/gallery'
            }
        ));
    }

    // 发布图片提示语
    webot.set('user gallery add start by text', {
        domain: "gateway",
        pattern: /^发布班级圈/i,
        handler: add_gallery_start
    });
    webot.set('user gallery add start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'IMAGE_ADD';
        },
        handler: add_gallery_start
    });

    // 查看图片
    webot.set('user gallery view start by text', {
        domain: "gateway",
        pattern: /^(班级圈|我的班级圈)/i,
        handler: view_gallery
    });
    webot.set('user gallery view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'IMAGE_VIEW';
        },
        handler: view_gallery
    });
}
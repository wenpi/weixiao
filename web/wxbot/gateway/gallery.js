/**
 * Usage:
 * - 图片功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var wxconst = require("../const");
var utils = require("../utils");
var BaseServices = require("../../services/BaseServices");
var GalleryServices = require("../../services/GalleryServices");

module.exports = function(webot) {
    function add_gallery_start(info, next) {
        /*
        var prompt = [
            "向班级圈分享文字、图片，仅本班所有家长及老师可见。",
            "上传照片前，请先输入主题文字，简单描述一下您要发布的照片内容。",
            "例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等，需在",
            conf.timeout.desc + "内完成该项操作。",
            "请点击左下侧键盘图标后输入照片主题："].join("\n");*/

        var user = info.session.parent || info.session.teacher;
        if (!user) {
            return next(null, "抱歉，您不是认证用户！");
        }

        info.wait("gallery type text");
        return next(null, ejs.render(
            ["分享孩子成长点滴到班级圈，仅供本班所有家长及老师访问。",
             '使用网页版，请<a href="<%- url%>">点击这里</a>',
             "如果使用微信对话框，请点击左下侧键盘图标后输入文字"].join("\n"), 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                    BaseServices.getAuthoriedParams(info.session.school.id, user.id)
            }
        ));
    }
    // 等待主题输入
    webot.waitRule('gallery type text', function(info, next) {
        if (info.is("event")) {
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("gallery type text");
            return next(null, "抱歉，只能输入文字。");
        }
        // 构造image
        info.session.gallery = {title: '', photos: []};
        info.session.gallery.title = info.text;

        info.wait("gallery type image or confirm");
        return next(null, "如需立即发布文字记录：\n回复【" + wxconst.YES + "】提交\n回复【" + wxconst.NO + "】取消\n\n如需继续发送图片记录，请选择上传图片。");
    });

    webot.waitRule('gallery type image or confirm', function(info, next) {
        if (info.is("event")) {
            delete info.session.gallery;
            return next();
        }

        var user = info.session.parent || info.session.teacher;

        // 接受提交指令
        if (info.is("text")) {
            if (info.text === wxconst.YES) {
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
                // 创建者
                info.session.gallery.createdBy = user.id;

                var derfer = '', classId = '';
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
                        '发布成功！请<a href="<%- url%>">点击这里</a>查看', 
                        {
                            url: conf.site_root + '/webot/wap/index.html?' + 
                                    BaseServices.getAuthoriedParams(info.session.school.id, user.id) +
                                    '#/class/' + classId + '/gallery'
                        }
                    ));
                }, function(err) {
                    delete info.session.gallery;
                    next(null, "抱歉，后台异常，无法提交。");
                });
            } else if (info.text === wxconst.NO) {
                delete info.session.gallery;
                return next(null, "操作已取消。");
            } else {
                utils.operation_is_failed(info, next);
                info.rewait("gallery type image or confirm");
                return next(null, "只能【" + wxconst.YES + "】或者【" + wxconst.NO + "】，或者选择上传图片。");
            }
        } else if (info.is("image")) {
            // 构造image
            if (info.session.gallery) {
                info.session.gallery.photos.push(info.param.picUrl);
            }
            info.rewait("gallery type image or confirm");
            var len = info.session.gallery.photos.length;
            return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n\n发送【" + wxconst.YES + "】发布\n发送【" + wxconst.NO + "】取消");
        } else {
            utils.operation_is_failed(info, next);
            info.rewait("gallery type image or confirm");
            return next(null, "抱歉，只能上传图片。");
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
        pattern: /^发布班级圈记录/i,
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
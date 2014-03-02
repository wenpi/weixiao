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

        return next(null, ejs.render(
            ["分享孩子成长点滴到班级圈，仅供本班所有家长及老师访问。",
             '使用网页版，请<a href="<%- url%>">点击这里</a>',
             "或请点击左下侧键盘图标后直接回复文字，图片："].join("\n"), 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                    BaseServices.getAuthoriedParams(info.session.school.id, user.id)
            }
        ));
    }

    function view_gallery(info, next) {
        var user = info.session.parent || info.session.teacher;
        if (!user) {
            return next(null, "抱歉，您不是认证用户！");
        }
        return next(null, ejs.render(
            '请<a href="<%- url%>">点击这里</a>查看', 
            {
                url: conf.site_root + '/webot/wap/index.html?' + 
                        BaseServices.getAuthoriedParams(info.session.school.id, user.id)
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
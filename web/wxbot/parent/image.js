/**
 * Usage:
 * - 发布图片功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");

module.exports = function(webot) {
	// 等待主题输入
	webot.waitRule('parent image input text', function(info, next) {
        if (info.is("event")) {
            return next();
        }
		if (!info.is("text")) {
			utils.operation_is_failed(info, next);
			info.rewait("parent image input text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.parent.publishImage = {title: '', urls: []};
		info.session.parent.publishImage.title = info.text;
		info.wait("parent image input image");
		return next(null, "主题【" + info.text + "】创建成功，请直接选择上传您要分享的图片：");
	});

	webot.waitRule('parent image input image', function(info, next) {
        if (info.is("event")) {
        	delete info.session.parent.publishImage;
            return next();
        }
		// 接受提交指令
		if (info.is("text") && info.text === '好') {
			if (info.session.parent.publishImage.urls.length == 0) {
				utils.operation_is_failed(info, next);
				info.rewait("parent image input image");
				return next(null, "您还没上传图片，请上传：");
			}
			// TODO 上传图片
			var title = info.session.parent.publishImage.title;
			console.info(info.session.parent.publishImage);
			delete info.session.parent.publishImage;
			return next(null, "主题为【" + title + "】的图片已发布！点击【班级相册】查看。");
		}
		// 接受取消指令
		if (info.is("text") && info.text === '不') {
			delete info.session.parent.publishImage;
			return next(null, "发布操作已取消，如需发布请再次点击【发布照片】。");
		}

		if (!info.is("image")) {
			utils.operation_is_failed(info, next);
			info.rewait("parent image input image");
			return next(null, "抱歉，只能上传图片。");
		} else {
			// 构造image
			if (info.session.parent.publishImage) {
				info.session.parent.publishImage.urls.push(info.param.picUrl);
			}
			info.wait("parent image input image");
			var len = info.session.parent.publishImage.urls.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n发送【好】发布图片，发送【不】取消发布");
		}
	});
}
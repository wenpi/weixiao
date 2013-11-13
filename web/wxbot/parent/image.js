/**
 * Usage:
 * - 留言功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
module.exports = function(webot) {
	// 留言提示语
	webot.set('parent image', {
		domain: "parent",
		pattern: /^(发布图片|(upload )?image|PARENT_IMAGE_INPUT)/i,
		handler: function(info, next) {
			info.wait("parent image input text");
			return next(null, "请" + conf.timeout.desc + "内完成该项操作，本次发布主题是：");
		}
	});
	// 等待主题输入
	webot.waitRule('parent image input text', function(info, next) {
		if (!info.is("text")) {
			info.rewait("parent image input text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.parent.uploadImage = {title: '', urls: []};
		info.session.parent.uploadImage.title = info.text;
		info.wait("parent image input image");
		return next(null, "请上传主题为【" + info.text + "】的图片：");
	});

	webot.waitRule('parent image input image', function(info, next) {
		// 接受提交指令
		if (info.is("text") && info.text === '好') {
			if (info.session.parent.uploadImage.urls.length == 0) {
				info.rewait("parent image input image");
				return next(null, "您还没上传图片，请上传：");
			}
			// TODO 上传图片
			var title = info.session.parent.uploadImage.title;
			console.info(info.session.parent.uploadImage);
			delete info.session.parent.uploadImage;
			return next(null, "主题为【" + title + "】的图片已发布！点击【我的发布】查看。");
		}
		// 接受取消指令
		if (info.is("text") && info.text === '不') {
			delete info.session.parent.uploadImage;
			return next(null, "发布操作已取消，如需发布请再次点击【我要发布】。");
		}

		if (!info.is("image")) {
			info.rewait("parent image input image");
			return next(null, "抱歉，只能上传图片。");
		}
		if (info.is("image")) {
			// 构造image
			if (info.session.parent.uploadImage) {
				info.session.parent.uploadImage.urls.push(info.param.picUrl);
			}
			info.wait("parent image input image");
			var len = info.session.parent.uploadImage.urls.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。发送【好】发布图片，发送【不】取消发布");
		}
	});
}
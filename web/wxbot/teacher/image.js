/**
 * Usage:
 * - 图片功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

module.exports = function(webot) {
	// 等待主题输入
	webot.waitRule('teacher image input text', function(info, next) {
		if (!info.is("text")) {
			info.rewait("teacher image input text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.teacher.publishImage = {title: '', urls: []};
		info.session.teacher.publishImage.title = info.text;
		info.wait("teacher image input image");
		return next(null, "请上传主题为【" + info.text + "】的图片：");
	});

	webot.waitRule('teacher image input image', function(info, next) {
		// 接受提交指令
		if (info.is("text") && info.text === '好') {
			if (info.session.teacher.publishImage.urls.length == 0) {
				info.rewait("teacher image input image");
				return next(null, "您还没上传图片，请上传：");
			}
			// TODO 上传图片
			var title = info.session.teacher.publishImage.title;
			console.info(info.session.teacher.publishImage);
			delete info.session.teacher.publishImage;
			return next(null, "主题为【" + title + "】的图片已发布！点击【班级相册】查看。");
		}
		// 接受取消指令
		if (info.is("text") && info.text === '不') {
			delete info.session.teacher.publishImage;
			return next(null, "发布操作已取消，如需发布请再次点击【发布照片】。");
		}

		if (!info.is("image")) {
			info.rewait("teacher image input image");
			return next(null, "抱歉，只能上传图片。");
		}
		if (info.is("image")) {
			// 构造image
			if (info.session.teacher.publishImage) {
				info.session.teacher.publishImage.urls.push(info.param.picUrl);
			}
			info.wait("teacher image input image");
			var len = info.session.teacher.publishImage.urls.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。发送【好】发布图片，发送【不】取消发布");
		}
	});
}
/*
 * GET home page.
 */

exports.index = function(req, res) {
	var schoolId = req.params.schoolId;
 	res.render('wap/index', { title: "WeeXiao" });
};
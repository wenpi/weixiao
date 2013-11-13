/*
 * GET home page.
 */

exports.index = function(req, res) {
	var schoolId = req.params.schoolId;
	console.info(schoolId);
 	res.render('wap/index', { title: "WeeXiao" });
};
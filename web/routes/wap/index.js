/*
 * GET home page.
 */

exports.index = function(req, res) {
	var placeId = req.params.placeId;
	console.info(placeId);
 	res.render('wap/index', { title: "WeeXiao" });
};
/*
 * GET register page.
 */
exports.register = function(req, res){
	var placeId = req.params.placeId;
	console.info(placeId);
 	res.render('wap/user/register', {});
};
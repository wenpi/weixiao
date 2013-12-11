/*
 * GET register page.
 */
exports.index = function(req, res){
 	res.render('wap/help/index', {type: req.params.htype});
};
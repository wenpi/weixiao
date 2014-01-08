/*
 * GET register page.
 */
var conf = require("../../conf");
exports.index = function(req, res){
	var path = conf.online ? '/webot' : ''
 	res.render('wap/help/index', {type: req.params.htype, path: path});
};
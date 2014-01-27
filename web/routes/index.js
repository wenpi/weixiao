/*
 * route to the wap
 */
var recordRoutes = require('./wap/record.js');
var conf = require('../conf');

module.exports = function(app) {
	// the web gui for the end user
	app.get('/wap/index', function(req, res) {
		var setting = {httpOnly: false};
		if (req.query.wexschool && req.query.wexuser && 
			req.query.wexkey && req.query.wextoken) {
                res.cookie('wexschool', req.query.wexschool, setting);
                res.cookie('wexuser', req.query.wexuser, setting);
                res.cookie('wexkey', req.query.wexkey, setting);
                res.cookie('wextoken', req.query.wextoken, setting);
                res.redirect('/webot/wap/index.html');
        } else {
        	res.redirect('/webot/wap/deny.html');
        }
	});

	// the web gui for the end user
	app.get("/wap/school/:schoolId/class/:classId/record/entry", recordRoutes.entry);
}
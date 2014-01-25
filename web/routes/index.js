/*
 * route to the wap
 */
var recordRoutes = require('./wap/record.js');

module.exports = function(app) {
	// the web gui for the end user
	app.get('/wap/index', function(req, res) {
		var setting = {httpOnly: false};
		if (req.query.wexuser && req.query.wexkey && req.query.wextoken) {
                res.cookie('wexuser', req.query.wexuser, setting);
                res.cookie('wexkey', req.query.wexkey, setting);
                res.cookie('wextoken', req.query.wextoken, setting);
                res.redirect('/wap/index.html');
        } else {
        	res.redirect('/wap/deny.html');
        }
	});

	// the web gui for the end user
	app.get("/wap/school/:schoolId/class/:classId/record/entry", recordRoutes.entry);
}
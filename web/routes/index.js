/*
 * route to the wap
 */
var defaultRoutes = require('./wap/index');
var helpRoutes = require('./wap/help.js');
var userRoutes = require('./wap/user.js');
var recordRoutes = require('./wap/record.js');

module.exports = function(app) {
	// the web gui for the end user
	app.get('/wap', function(req, res) {
		res.redirect('/wap/index.html');
	});

	// the web gui for the end user
	app.get('/wap/school/:schoolId', defaultRoutes.index);
	app.get("/wap/school/:schoolId/register", userRoutes.register);
	app.get("/wap/school/:schoolId/class/:classId/record/entry", recordRoutes.entry);
}
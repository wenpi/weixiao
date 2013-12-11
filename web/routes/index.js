/*
 * route to the wap
 */
var defaultRoutes = require('./wap/index');
var helpRoutes = require('./wap/help.js');
var userRoutes = require('./wap/user.js');

module.exports = function(app) {
	// the web gui for the end user
	app.get('/wap', function(req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
  		res.end('Hello World\n');
	});

	// the web gui for the end user
	app.get('/wap/help/:htype', helpRoutes.index);
	app.get('/wap/school/:schoolId', defaultRoutes.index);
	app.get("/wap/school/:schoolId/register", userRoutes.register);
}
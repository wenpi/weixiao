/*
 * route to the wap
 */
var defaultRoutes = require('./wap/index');
var userRoutes = require('./wap/user.js');

module.exports = function(app) {
	// the web gui for the end user
	app.get('/wap/place/:placeId', defaultRoutes.index);
	app.get("/wap/place/:placeId/register", userRoutes.register);
}
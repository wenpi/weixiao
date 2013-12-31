/*
 * route to the wap
 */
var school = require('./school');

module.exports = function(app) {
	app.get("/api/school/:_id/syncmenu", school.syncWeixinMenu());
}
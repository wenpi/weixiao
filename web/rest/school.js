var SchoolMenuServices = require("../services/SchoolMenuServices");

/*
 * GET sync the local menu to remote
 */
exports.syncWeixinMenu = function() {
    return function(req, res) {
        if(!req.params._id) {
            return res.json(400, {error: "id is required."})
        }
        if(!req.query.appId) {
            return res.json(400, {error: "app id is required."})
        }
        if(!req.query.appSecret) {
            return res.json(400, {error: "app secret is required."})
        }

        SchoolMenuServices.syncWeixinMenu(req.params._id, {
            appId: req.query.appId,
            appSecret: req.query.appSecret
        }).then(function(result) {
            res.json(200, result);
        }, function(err) {
            res.json(500, err);
        });
    };
};

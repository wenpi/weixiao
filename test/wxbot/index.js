module.exports = function() {
	require("./school_bind")();
	require("./parent_register")();
	require("./parent_leave_message")();
}

// webot send --des http://localhost:3000/weixin/api --token weexiao --user u13811111111 t 认证13811111111
// webot send --des http://localhost:3000/weixin/api --token weexiao --user u13811111111 e KID_RECORD_ADD
// webot send --des http://localhost:3000/weixin/api --token weexiao --user u13833333333 t 认证1383333333
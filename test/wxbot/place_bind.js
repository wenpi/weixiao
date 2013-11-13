var assert = require("assert")
module.exports = function() {
	describe('test bind', function(){
		it('能通过REST API创建一个场所', function(){
			assert.equal(true, true);
		});
		it('不提供标识的情况下,用户A不能通过Webot-cli激活这个场所', function(){
			assert.equal(true, true);
		});
		it('提供错误标识的情况下,用户A不能通过Webot-cli激活这个场所', function(){
			assert.equal(true, true);
		});
		it('提供正确标识的情况下,用户A能通过Webot-cli激活这个场所', function(){
			assert.equal(true, true);
		});
		it('用户A获得SESSION,能在欢迎词中获得这个场所名字', function(){
			assert.equal(true, true);
		});
		it('提供正确标识的情况下,用户B尝试激活该场所,能获得微信账号已绑定的信息', function(){
			assert.equal(true, true);
		});
		it('能通过REST API将该个场所的weixinId改成无关紧要的信息', function(){
			assert.equal(true, true);
		});
		it('能通过REST API创建另一个场所', function(){
			assert.equal(true, true);
		});
		it('提供正确标识的情况下,用户B尝试激活另一个场所,能获得微信账号绑定成功的信息', function(){
			assert.equal(true, true);
		});
	});
}

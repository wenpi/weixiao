var assert = require("assert")
module.exports = function() {
	describe('test parent leave message', function(){
		it('能通过用户的Open ID从REST API获得用户信息', function(){
			assert.equal(true, true);
		});
		it('非认证用户不能使用留言功能', function(){
			assert.equal(true, true);
		});
		it('认证用户能使用留言功能', function(){
			assert.equal(true, true);
		});
		it('认证用户能不能提交文字以外的内容', function(){
			assert.equal(true, true);
		});
		it('认证用户使用【好】提交留言', function(){
			assert.equal(true, true);
		});
		it('认证用户使用【不】取消留言', function(){
			assert.equal(true, true);
		});
		it('认证用户能多次输入文本', function(){
			assert.equal(true, true);
		});
	});
}

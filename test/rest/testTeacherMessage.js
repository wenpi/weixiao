var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test message api : ', function(){
        var schoolId = null;
        // 能获得学校数据
        it('success to get a school data for message module with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryPagingList("/api/school", {token: 'basic-valid'})
                    .then(function(schools) {
                        assert.notEqual(0, schools.length);
                        schoolId = schools[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得教师ID
        var teacherId = 0;
        it('success to get teacher data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher", {token: 'basic-valid'})
                    .then(function(teahcers) {
                        assert.notEqual(0, teahcers.length);
                        teacherId = teahcers[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能获得班级id
        var classId;
        it('success to get class data with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class", {token: 'basic-valid'})
                    .then(function(wexclasses) {
                        assert.notEqual(0, wexclasses.length);
                        classId = wexclasses[0].id;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除关系，无论成功与否
        it('success to delete the reference between class and teacher', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token,该教师无法向这个班级提交信息
        it('failed to create message data without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/message', 
                        {content: '测试消息'}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not create a message"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 即使有token,该教师依然无法向这个班级提交信息
        it('failed to create message data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/message', 
                        {content: '测试消息', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        callback(new Error("should not create a message"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 增加绑定
        it('success to create the reference between class and teacher', function(done){
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/teacher/" + teacherId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should assgin a teacher to a class"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token无法获得消息列表
        it('failed to get the total message of the class without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message", {token: 'basic-none'})
                    .then(function(messages) {
                        callback(new Error("should not get the message"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 获得通知的总数
        var count = nCount = pCount = tCount = 0;

        it('success to get the total message of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message", {token: 'basic-valid'})
                    .then(function(messages) {
                        count = messages.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the notice of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message?type=1", {token: 'basic-valid'})
                    .then(function(messages) {
                        nCount = messages.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the message submitted by parent of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message?type=0", {token: 'basic-valid'})
                    .then(function(messages) {
                        pCount = messages.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to get the message count of the teacher with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/message", {token: 'basic-valid'})
                    .then(function(messages) {
                        tCount = messages.length;
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能提交一条普通消息
        it('success to create message data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/message', 
                        {content: '普通消息', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        console.info(err);
                        callback(new Error("should create a message"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一
        it('success to get a newer total message of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message", {token: 'basic-valid'})
                    .then(function(messages) {
                        assert.equal(count + 1, messages.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一
        it('success to get a newer count of the notice of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message?type=1", {token: 'basic-valid'})
                    .then(function(messages) {
                        assert.equal(nCount + 1, messages.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数不变
        it('success to get a newer count of the message submitted by parent in class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message?type=0", {token: 'basic-valid'})
                    .then(function(messages) {
                        assert.equal(pCount, messages.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 总数加一
        it('success to get a newer message count of the teacher with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/teacher/" + teacherId + "/message", {token: 'basic-valid'})
                    .then(function(messages) {
                        assert.equal(tCount + 1, messages.length);
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 能提交一条置顶消息
        var messageId;
        it('success to create message data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/teacher/' + teacherId + '/message', 
                        {content: '置顶消息', top: 1, createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function(id) {
                        messageId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a message"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法解除置顶
        it('failed to untop the message with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + '/message/' + messageId, 
                        {top: 0, updatedBy: teacherId}, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not untop a message"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 解除置顶
        it('success to untop the message with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.update("/api/school/" + schoolId + '/message/' + messageId, 
                        {top: 0, updatedBy: teacherId}, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should untop a message"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to create a reply without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/message/' + messageId + '/reply', 
                        {content: '回复', createdBy: teacherId}, {token: 'basic-none'})
                    .then(function(id) {
                        callback(new Error("should not create a reply"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 添加一条回复，在GUI中公共类型消息是没有回复的，仅仅是为了测试API是否可用
        var replyId;
        it('success to create a reply with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/message/' + messageId + '/reply', 
                        {content: '回复', createdBy: teacherId}, {token: 'basic-valid'})
                    .then(function(id) {
                        replyId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a reply"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('failed to remove the reply without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/message/' + messageId + '/reply/' + replyId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a reply"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        it('success to remove the reply with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/message/' + messageId + '/reply/' + replyId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should create a reply"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 无法删除消息
        it('success to remove the message with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/message/' + messageId, {token: 'basic-none'})
                    .then(function() {
                        callback(new Error("should not remove a message"));
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 删除消息
        it('success to remove the message with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.remove("/api/school/" + schoolId + '/message/' + messageId, {token: 'basic-valid'})
                    .then(function() {
                        done();
                    }, function(err) {
                        callback(new Error("should remove a message"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });


    });
}
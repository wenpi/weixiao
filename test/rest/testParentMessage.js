var assert = require("assert")
var async = require("async");
var base = require("./base");
var SERVER = base.config().SERVER;

module.exports = function() {
    describe('test parent message api : ', function(){
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

        // 能获得班级id
        var classId;
        it('success to get class data with basic token', function(done){
            assert.notEqual(null, schoolId);
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

        var mobile = '13' + (new Date()).getTime().toString().substring(4, 13);
        
        // 能创建家长账号信息及孩子信息
        var parentId;
        it('success to create a parent and a student', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + "/class/" + classId + "/parent", 
                        {name: "孩子1", gender: 1, mobile: mobile, photo: 'none', createdBy: 'creator'}, {token: 'basic-valid'})
                    .then(function(id) {
                        parentId = id;
                        done();
                    }, function(err) {
                        callback(new Error("should create a parent and a student"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        var studentId;
        it('success to get the new student id', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/student", {token: 'basic-valid'})
                    .then(function(students) {
                        assert.notEqual(0, students.length);
                        studentId = students[0].id;
                        done();
                    }, function(err) {
                        callback(new Error("should get the student id"));
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });


        // 有token也不能看本班其他家长的留言
        it('failed to get the message list of the class with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message?type=0", {user: parentId})
                    .then(function(messages) {
                        callback(err);
                    }, function(err) {
                        done();
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });
        

        // 获得通知的总数
        var count = 0;

        // TODO:不能查看非所在班级通知

        // 能查看所在班级通知
        it('success to get the notice of the class with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/class/" + classId + "/message?type=1", {token: 'basic-valid'})
                    .then(function(messages) {
                        done();
                    }, function(err) {
                        callback(err);
                    });
                }
            }, function(err, results) {
                done(err);
            });
        });

        // 没有token无法获得孩子相关的留言列表
        it('failed to get the total message of the student without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/message", {token: 'basic-none'})
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

        // TODO: 不能查看非本人孩子的留言

        // 能查看本人孩子的留言
        it('success to get the message of the student with user token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/student/" + studentId + "/message", {user: parentId})
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
        return;

        // TODO: 不能查看非本人提交的留言

        // 能查看本人提交的留言
        it('success to get the message count of the parent with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/message", {token: 'basic-valid'})
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

        // 能提交一条留言
        it('success to create message data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/parent/' + parentId + '/message', 
                        {content: '普通留言', createdBy: parentId}, {token: 'basic-valid'})
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
        it('success to get a newer message count of the parent with basic token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.queryAll("/api/school/" + schoolId + "/parent/" + parentId + "/message", {token: 'basic-valid'})
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

        // 能提交一条置顶留言
        var messageId;
        it('success to create message data with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/class/" + classId + '/parent/' + parentId + '/message', 
                        {content: '置顶留言', top: 1, createdBy: parentId}, {token: 'basic-valid'})
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

        it('failed to create a reply without token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/message/' + messageId + '/reply', 
                        {content: '回复', createdBy: parentId}, {token: 'basic-none'})
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

        // 添加一条回复，在GUI中公共类型留言是没有回复的，仅仅是为了测试API是否可用
        var replyId;
        it('success to create a reply with token', function(done){
            // an example using an object instead of an array
            async.series({
                action: function(callback){
                    base.create("/api/school/" + schoolId + '/message/' + messageId + '/reply', 
                        {content: '回复', createdBy: parentId}, {token: 'basic-valid'})
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

        // 回复不能被家长删除
        it('failed to remove the reply with token', function(done){
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

        // 没有token不能删除留言
        it('failed to remove the message without token', function(done){
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

        // 有token删除留言
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
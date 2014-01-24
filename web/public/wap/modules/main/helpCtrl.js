/**
 * 需要外部传入的app, 则`module.exports`为function
 */
define(function (require, exports, module) {
    'use strict';

    module.exports = function(app){
    //Step6: use `app.register` to register controller/service/directive/filter
    app.register.controller('helpCtrl', ['$scope', '$routeParams', '$location', '$http',
        function($scope, $routeParams, $location, $http){
            $scope.help = {};

            var title = '', contents = [];
            switch($routeParams.type) {
            case 'about':
                title = '关于微信幼儿园';
                contents.push("微笑（www.weexiao.com)，是一个基于移动互联网的早期教育产品及服务平台。我们致力于用优秀的技术结合贴近需求的创意，为万千家庭及儿童创造更多愉快而科学的成长体验。");
                contents.push("微信幼儿园是我们的核心产品。以微信为入口，我们为中国0-6岁早期教育机构提供完整的移动互联网业务解决方案，开创一种全新的园所文化和家校沟通方式，实现随时随地的家园连接，为儿童和家庭创建一种简单紧密的成长共享氛围。");
                contents.push("我们的团队中既有移动互联网领域经验丰富的产品及技术人员，也有早期教育领域深耕多年的一线专家顾问。我们将陆续应用最新的技术，工具，及平台，带给中国0-6岁早期教育市场前所未有、未曾体验过的创新产品及服务。");
            break;
            case 'register':
                title = '如何进行身份认证';
                contents.push("第一步：在公众账号里点击左下角键盘图标，出现输入框之后，回复手机号码（请确保此手机号码与你提供给幼儿园的手机号码一致）");
                contents.push("第二步：根据消息引导，上传你的头像照片（点击右侧“+”号后，再点击“照片”从相册里选择头像添加。家长用户请上传孩子的头像，方便老师辨识。");
                contents.push("第三步：点击“认证链接”后，输入预设密码（预设密码由本园老师直接发放给家长）后，完善和确认孩子的个人资料，包括选择孩子生日，父母身份等，点击“完成”即可完成认证。");
                contents.push('<img src="images/help/register.jpeg">');
            break;
            }
            contents.push('任何问题或建议，请发邮件到');
            contents.push('<a href="mailto:support@weexiao.com">support@weexiao.com</a>');
            $scope.help.title = ' - ' + title;
            $scope.help.content = '<div><p>' + contents.join("</p><p>") + '</p></div>';
        }]
    );
    }
});
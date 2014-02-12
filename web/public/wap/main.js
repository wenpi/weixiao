document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    WeixinJSBridge.call('hideOptionMenu');
    WeixinJSBridge.call('hideToolbar');
});

var getArgs = function () {
    var args = new Object(); //声明一个空对象 
    var query = window.location.search.substring(1); // 取查询字符串，如从 http://www.snowpeak.org/testjs.htm?a1=v1&a2=&a3=v3#anchor 中截出 a1=v1&a2=&a3=v3。 
    var pairs = query.split("&"); // 以 & 符分开成数组 
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); // 查找 "name=value" 对 
        if (pos == -1) continue; // 若不成对，则跳出循环继续下一对 
        var argname = pairs[i].substring(0, pos); // 取参数名 
        var value = pairs[i].substring(pos + 1); // 取参数值 
        value = decodeURIComponent(value); // 若需要，则解码 
        args[argname] = value; // 存成对象的一个属性 
    }
    return args; // 返回此对象 
}
// seajs config
seajs.config({
	// Enable plugins
  	plugins: ['shim', 'nocache', 'text'],
    base: './',
 	// 调试模式
  	debug: true
});

seajs.on('error', function(module){
    if(module.status!=5){
        console.error('seajs error: ', module);
    }
});

//Step2: bootstrap youself
seajs.use(['app'], function(app){
    angular.bootstrap(document, ['app']);
});
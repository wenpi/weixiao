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
	$("#loading").hide();
    angular.bootstrap(document, ['app']);
});
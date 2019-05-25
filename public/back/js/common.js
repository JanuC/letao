
// 开启进度条
// NProgress.start();

// 结束进度条
// setTimeout(function() {
// NProgress.done();

// },2000)


// 实现在第一个ajax发送的时候开启进度条
// 在所有的ajax请求都完成的时候,结束进度条

// ajax全局事件
// 1. ajaxComplate 当每个ajax完成的时候,调用(不管成功还是失败,都调用)
// 2. ajaxError 当ajax请求失败的时候,调用
// 3. ajaxSuccess 当ajax请求成功的时候,调用
// 4. ajaxSend 在每个ajax请求发送前,调用
// 5. ajaxStart 在第一个ajax发送时,调用
// 6. ajaxStop 在所有ajax请求完成时,调用


// 在第一个ajax发送时,调用
$(document).ajaxStart(function() {
  // 开启进度条
  NProgress.start();
});

// 在所有的ajax完成时调用
$(document).ajaxStop(function() {
  NProgress.done();
})
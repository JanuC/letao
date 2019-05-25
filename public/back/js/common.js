
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

// 登录拦截功能,登录页面不需要校验,不用登录就能访问登录页
// 前后分离了,前端是不知道该用户是否登录了,但是后台知道,发送ajax请求查询用户状态即可
// (1) 用户已登录,啥都不用做,让用户继续访问
// (2) 如果用户未登录,拦截到登录页

if(location.href.indexOf("login.html") === -1) {
  
  // 地址栏中没有 login.html,说明不是登录页,进行登录拦截
  $.ajax({
    type: "get",
    url: "/employee/checkRootLogin",
    dataType: "json",
    success: function(info) {
      console.log(info);
      if(info.success) {
        console.log("已登录");
        
      }
      if(info.error === 400) {
        // 未登录,拦截到登录页 
        location.href = "login.html";
      }
    }
  })
  
}


$(function() {

  // 1. 分类管理切换功能

  $('.nav .category').click(function() {
    // 切换child的显示隐藏
    $('.nav .child').stop().slideToggle();
  });

  // 2. 左侧侧边栏切换功能

  $('.ico_menu').click(function() {
    $('.lt_aside').toggleClass("hidemenu");
    $('.lt_topbar').toggleClass("hidemenu");
    $('.lt_main').toggleClass("hidemenu");
  })

  // 3. 点击topbar退出按钮,弹出模态框
  $('.ico_logout').click(function() {
    // 显示模态框 modal('show')
    $('#logoutModal').modal('show');
  })

  // 4. 点击模态框退出按钮,实现退出功能
  $('#logoutBtn').click(function() {
    // 发送ajax请求,进行退出
    $.ajax({
      url: "/employee/employeeLogout",
      type: "get",
      dataType: "json",
      success: function(info) {
        if(info.success) {
          // 退出成功,跳转到登录页
          location.href = "login.html";
        }
      }
    })
  })



})
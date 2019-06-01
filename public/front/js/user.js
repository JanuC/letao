
$(function() {

  // 一进入页面,发送ajax请求,进行动态渲染
  $.ajax({
    type: "get",
    url: "/user/queryUserMessage",
    dataType: "json",
    success: function(info) {
      console.log(info);
      if(info.error === 400) {
        location.href = "login.html?back=user";
        return;
      }
      var htmlStr = template('tpl',info);
      $('.mui-scroll').html(htmlStr);
      
    }

  })

  // 退出功能
  $('.mui-scroll').on('tap','.btn_logout',function() {
    $.ajax({
      type: "get",
      url: "/user/logout",
      dataType: "json",
      success: function(info) {
        // console.log(info);
        if(info.success) {
          location.href = "index.html";
        }
      }
    })
  })


})
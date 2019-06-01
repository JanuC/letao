

$(function() {

  // 一进入页面,获取地址栏数据,没参数id拦截到登录页
  var id = getSearch('id');
  if(!id) {
    location.href = "login.html?back=cart";
    return ;
  }
  // 1. 已经登录,发送ajax请求,获取数据
  $.ajax({
    type: "get",
    url: "/cart/queryCart",
    dataType: "json",
    success: function(info) {
      console.log(info);
      var htmlStr = template('tpl',{info});
      $('.mui-content').html(htmlStr);
    }
  })

  // 2. 点击编辑按钮,更新数据
  $('.mui-content').on('tap','.btn_update',function() {
    // 弹出消息框
    

  })
  
  
})
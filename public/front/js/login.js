

$(function() {

  // 一进入页面,获取地址栏数据,得到是从哪里跳转到登录页
  var back = getSearch('back');

  // 点击登录按钮,发送ajax请求登录
  $('.btn-login').on('tap',function() {

    // 表单校验
    var check = true;
    mui("#form input").each(function() {
      //若当前input为空，则alert提醒 
      
      if(!this.value || this.value.trim() == "") {
          var label = this.previousElementSibling;
          mui.toast("请输入" + label.innerText);
          check = false;
          return false;
      }
      }); //校验通过，继续执行业务逻辑 
      if(check){
        // mui.alert('验证通过!')

        // 获取用户输入的内容
        var username = $('[type="text"]').val();
        var password = $('[type="password"]').val();

        // 发送ajax请求进行提交
        $.ajax({
          type: "post",
          url: "/user/login",
          data: {
            username: username,
            password: password
          },
          dataType: "json",
          success: function(info) {
            // console.log(info);
            if(info.success) {
              console.log(1);
              // 登录完成后,发送ajax请求获取数据
              $.ajax({
                type: "get",
                url: "/user/queryUserMessage",
                dataType: "json",
                success: function(info) {
                  console.log(info);
                  var id = info.id;
                  if(back === "cart") {
                    location.href = "cart.html?id=" + id;
                  }
                  if(back === "user") {
                    location.href = "user.html?id=" + id;
                  }
                }
              })
              
              // location.href = "user.html";
            }
            if(info.error === 403) {
              mui.toast(info.message);
              return;
            }
            
          }
    
    
        })
      }



 
   

  })

  // 点击重置按钮,重置表单的内容
  $('.btn_reset').on('tap',function() {
    $('#form input').val('');
  })






})
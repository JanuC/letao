

$(function() {

  // 1. 一进入页面,发送ajax请求,获取数据,通过模板引擎进行渲染

  var productId = getSearch("productId");
  
  $.ajax({
    type: "get",
    url: "/product/queryProductDetail",
    data: {
      id: productId,
    },
    dataType: "json",
    success: function(info) {
      // 获取info中尺码的范围
      var sizeStr = info.size;
      var sizeArr = getSize(sizeStr);
      // console.log(sizeArr);

      // 将生成的数组挂载在indo中,便于渲染
      info.sizeArr = sizeArr;

      console.log(info);

      

      var htmlStr = template('tpl', info);
      $('.mui-scroll').html(htmlStr);

      // 配置轮播图自动轮播

      //获得slider插件对象
      var gallery = mui('.mui-slider');
      gallery.slider({
        interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
      });

      // 初始化数字单选框
      mui(".mui-numbox").numbox();
    }
  })

  // 2. 尺码选择
  $('.mui-scroll').on('tap','.lt_size span',function() {
    $(this).toggleClass('current').siblings().removeClass('current');
  })

  // 3. 加入购物车功能
  $('.addCart').on('tap',function() {
    if($('.lt_size span.current').length === 0) {
    // 没有选择尺码
      mui.toast('请选择尺码');
    }else {
      // 选择了尺码
      // 发送ajax请求需要参数 productId num size
      var size = $('.lt_size span.current').text();
      var num = mui(".mui-numbox").numbox().getValue();

      $.ajax({
        type: "post",
        url: "/cart/addCart",
        data: {
          productId: productId,
          num: num,
          size: size
        },
        dataType: "json",
        success: function(info) {
          console.log(info);
          
        }
      })

    }
  })





  // 封装一个方法,用于获取尺码格式如: 32-34,返回一个数组 [32,33,32]
  function getSize(size) {
    var arr = size.split("-"); // [32,34]
    var sizeMin = parseInt(arr[0]) ; // 32
    var sizeMax =  parseInt(arr[1]); // 34
    var len = sizeMax - sizeMin + 1;
    var sizeArr = [];
    for(var i = 0; i < len; i++) {
      sizeArr.push(sizeMin + i);
    }
    // console.log(sizeArr);
    return sizeArr;
  }





})
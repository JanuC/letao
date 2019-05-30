

$(function() {

  // 1. 一进入页面,获取地址栏传过来的参数,并赋值给搜索框
  

  // 调用封装好的方法,得到一个对象
  var key = getSearch("key");

  // 设置给input
  $('.search_input').val(key);

  // 2. 根据搜索关键字发送 ajax请求,进行页面渲染
  render();
  function render() {

    // 准备请求数据,渲染时,显示加载中的效果
    $('.lt_product').html(' <div class="loading"></div>');


    var params = {};
    // 三个必传的参数
    params.proName = $('.search_input').val();
    params.page= 1;
    params.pageSize = 100;

    // (1) 两个可穿可不传的参数,需要根据高亮的a来判断穿哪个参数
    // (2) 通过箭头判断升序还是降序
    // 价格: price 1:升序 2: 降序
    // 库存: num 1: 升序 2: 降序

    var $current = $('.lt_sort a.current')
    if($current.length > 0) {
      // 有高亮的啊,说明需要进行排序
      // 获取传给后台的键
      var sortName = $current.data('type');
      // 获取传给后台的值,通过箭头来判断
      var sortVal = $current.find('i').hasClass('fa-angle-down') ? 2 : 1;
      // 添加到params中
      params[sortName] = sortVal;

    }
    

   setTimeout(function() {
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: params,
      dataType: "json",
      success: function(info) {
        var htmlStr = template('tpl',info);
        $('.lt_product').html(htmlStr);
      }
    })
   },500)
  }

  // 3. 点击搜索功能,实现搜索功能
  $('.search_btn').click(function() {
    
    
    // 需要将搜索关键字追加存储到本地存储中
    var key = $('.search_input').val();

    if(key.trim() === '') {
      mui.toast("请输入搜索内容");
      return;
    }

    render();
    // 获取数组
    var jsonStr = localStorage.getItem('search_list') || '[]';
    var arr = JSON.parse(jsonStr);

    // 1. 要删除重复的项
    // 2. 长度限制在10
    var index = arr.indexOf(key);

    if(index != -1) {
      arr.splice(index,1);
    }

    if(arr.length >= 10) {
      arr.pop();
    }

    // 将key追加到数组最前面
    arr.unshift(key);

    // 转成json
    localStorage.setItem('search_list',JSON.stringify(arr));

  })

  // 4. 排序功能
  // 通过属性选择器给价格和库存添加点击事件
  // (1) 如果自己有 current 类,切换箭头方向即可
  // (2) 如果自己没有 current 类,添加上current类,并且移除兄弟元素的 current 类
  $('.lt_sort a[data-type]').click(function() {
    if($(this).hasClass('current')) {
      // 有 current 类,切换箭头几个
      $(this).find('i').toggleClass("fa-angle-up").toggleClass('fa-angle-down');
    }else {
      $(this).addClass('current').siblings().removeClass('current');
      $(this).siblings().find('i').addClass('fa-angle-down').removeClass('fa-angle-up');
    }
    render();
  })
  
 
  







})


$(function() {

  var currentPage = 1; // 当前页
  var pageSize = 2; // 每页多少条

  // 1. 一进入页面,获取地址栏传过来的参数,并赋值给搜索框
  

  // 调用封装好的方法,得到一个对象
  var key = getSearch("key");

  // 设置给input
  $('.search_input').val(key);

  // 配置下拉刷新和上拉加载注意点:
  // 下拉刷新是对原有数据的覆盖,执行的是 html 方法
  // 上拉加载实在原有结构基础上进行追加,追加到后面,执行的是append方法

  mui.init({
    // 配置 pullRefresh
    pullRefresh : {
      container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
      
      // 配置下拉刷新
      down : {
        // 配置一进入页面就自动下拉刷新一次
        auto: true,
        callback : function() {
          // console.log("下拉刷洗了");

          // 加载第一页的数据
          currentPage = 1;


          // 拿到数据后,需要执行的方法是不一样的,所以通过回调函数的方式,传递进去执行
          render(function(info) {
            var htmlStr = template('tpl',info);
            $('.lt_product').html(htmlStr);

            // ajax 回来之后,需要结束下拉刷新,让内容回滚顶部
            // 注意: api 做了更新,mui文档上还没更新(小坑)
            // 要使用原型上的 endPulldownToRefresh 方法来结束下拉刷新
            // console.log(mui('.mui-scroll-wrapper').pullRefresh());
            
            mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

            // 第一页数据被重新加载之后,又有数据可以进行上拉加载了,需要启用上拉加载
            mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
          });
        } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
      },
      // 配置上拉加载
      up: {
        callback: function() {
          
          // 需要加载下一页的数据
          currentPage ++;
          render(function(info) {
            var htmlStr = template('tpl',info);
            $('.lt_product').append(htmlStr);
            
            // 当数据回来之后,需要结束上拉加载
            // endPullupToRefresh(boolean) 结束上拉加载
            // 1. 如果传 true,没有更多数据,会显示提示语句,会自动禁用上拉加载,防止发送无效的ajax
            // 2. 如果传 false,还有更多数据

            if(info.data.length === 0) {
              // 没有更多数据了,显示提示语句
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);

            }else {
              // 还有数据,正常结束上拉加载
              mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
            }

          });

        }
      }
    }
  });



  // 2. 根据搜索关键字发送 ajax请求,进行页面渲染
  // render();


  // // 3. 点击搜索功能,实现搜索功能
  $('.search_btn').click(function() {
    
    
    // 需要将搜索关键字追加存储到本地存储中
    var key = $('.search_input').val();

    if(key.trim() === '') {
      mui.toast("请输入搜索内容");
      return;
    }

    // render();
    // 执行一次下拉刷新即可,在下拉刷新回调中,会进行页面渲染
    // 调用 pulldownLoading()  执行下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();




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

  // // 4. 排序功能
  // // 通过属性选择器给价格和库存添加点击事件
  // // (1) 如果自己有 current 类,切换箭头方向即可
  // // (2) 如果自己没有 current 类,添加上current类,并且移除兄弟元素的 current 类
  
  // 注意: mui认为在下拉刷新和上拉加载容器中,使用 click 会有300ms延时,性能方面不足
  // 禁用了默认的 a 标签的click事件,需要绑定 tap 事件
  $('.lt_sort a[data-type]').on("tap",function() {
    if($(this).hasClass('current')) {
      // 有 current 类,切换箭头几个
      $(this).find('i').toggleClass("fa-angle-up").toggleClass('fa-angle-down');
    }else {
      $(this).addClass('current').siblings().removeClass('current');
      $(this).siblings().find('i').addClass('fa-angle-down').removeClass('fa-angle-up');
    }
    //render();

    // 执行一次下拉刷新即可,在下拉刷新回调中,会进行页面渲染
    // 调用 pulldownLoading()  执行下拉刷新
    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
  })


  // 5. 点击商品,实现页面跳转,注册点击事件,通过事件委托注册,注册tab事件
  $('.lt_product').on('tap','a',function() {
    var id = $(this).data('id');
    location.href = "product.html?productId=" + id;
  })




  function render(callback) {


    // 准备请求数据,渲染时,显示加载中的效果
    // $('.lt_product').html(' <div class="loading"></div>');


    var params = {};
    // 三个必传的参数
    params.proName = $('.search_input').val();
    params.page= currentPage;
    params.pageSize = pageSize;

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

        // 真正拿到数据后执行的操作,通过callback函数传递进来了
        callback && callback(info);

      }
    })
   },500)
  }
  
 
  







})
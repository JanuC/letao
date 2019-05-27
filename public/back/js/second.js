

$(function() {
  var currentPage = 1;
  var pageSize = 5;
  // 1. 一进入页面,发送ajax请求,进行页面渲染
  render();
  function render() {
    $.ajax({
      type: 'get',
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template('tpl',info);
        $('tbody').html(htmlStr);
  
        // 分页功能
        $('#paginator').bootstrapPaginator({
          // 指定bootstrap版本
          bootstrapMajorVersion: 3,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 当前第几页
          currentPage: info.page,
          // 给分页按钮注册点击事件
          onPageClicked: function(a,b,c,page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染页面
            render();
          }
        })
      }
    })
  }

  // 2. 添加分类功能
  $('#addBtn').click(function() {
    $('#addModal').modal('show');
    
    // 发送ajax请求,获取一级分类全部数据,通过模板引擎进行渲染

    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: 1,
        pageSize: 99
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template('li_tpl',info);
        $('#first_ul').html(htmlStr);

        // 3.点击一级分类,选中相应分类
        $('#first_ul').on("click","a",function() {
          $('#dropdownText').html($(this).html());

          // 获取选中的id
          var id = $(this).data('id');
          $('[name="categoryId"]').val(id);
        })
        

        // 4. 进行文件上传初始化
        $('#fileUpload').fileupload({
          // 配置返回的数据格式
          dataType: "json",
          // 图片上传完成后,会调用done回调函数
          done: function(e,data) {
            // console.log(data.result.picAddr);
            // 获取上传得到的图片地址
            var imgUrl = data.result.picAddr;
            $('#imgBox img').attr('src',imgUrl);
            // 将图片地址设置给input
            $('[name="brandLogo"]').val(imgUrl);
          }
        })


        /**
         * 文件上传思路整理:
         *  1.引包
         *  2.准备结构,name,data-url
         *  3.进行文件上传初始化,配置done回调函数
         */


      }
    })



  })







}) 


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
  })







}) 
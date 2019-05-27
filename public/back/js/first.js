


$(function() {
  var currentPage = 1;
  var pageSize = 5;

  // 1. 一进入页面,发送ajax请求,获取数据,进行模板引擎渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template('tpl',info);
        $('tbody').html(htmlStr);
  
        // 进行分页初始化
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


  // 2. 点击添加分类按钮,显示模态框

  $('#addBtn').click(function() {
    $('#addModal').modal('show');
  })

  // 3. 使用表单校验插件,实现表单校验
  $('#form').bootstrapValidator({
     //配置校验图标
     feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    // 配置字段
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "一级分类不能为空"
          }
        }
      }
    }
  })

  // 4. 注册表单校验成功事件,阻止默认的成功提交,通过ajax进行提交
  $('#form').on("success.form.bv",function(e) {
    e.preventDefault();

    // 通过ajax进行提交
    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $('#form').serialize(),
      dataType: "json",
      success: function(info) {
        console.log(info);
        if(info.success) {
          // 添加成功
          // 1. 关闭模态框
          $('#addModal').modal('hide');
          // 2. 页面重新渲染第一页,让用户看到第一页的数据
          currentPage = 1;
          render();
          // 3. 重置模态框 resetForm(true) 不仅重置校验状态,还重置表单内容
          $('#form').data('bootstrapValidator').resetForm(true);
        }
      }
    })
  })







})





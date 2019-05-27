

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

          // 将隐藏域校验状态,设置成校验成功状态 updateStatus
          // updateStatus(字段名,校验状态,姜堰规则)
          $('#form').data('bootstrapValidator').updateStatus("categoryId","VALID");
        })
        

        // 4. 进行文件上传初始化
        /**
         * 文件上传思路整理:
         *  1.引包
         *  2.准备结构,name,data-url
         *  3.进行文件上传初始化,配置done回调函数
         */
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

            // 手动重置隐藏域的校验状态
            $('#form').data("bootstrapValidator").updateStatus("brandLogo","VALID");
          }
        })

        // 5. 实现表单校验
        $('#form').bootstrapValidator({
          // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
          // 我们需要对隐藏域进行校验,所以不需要将隐藏域排除到校验范围外
          excluded: [],
          //配置校验图标
          feedbackIcons: {
            valid: 'glyphicon glyphicon-ok', // 校验成功
            invalid: 'glyphicon glyphicon-remove', // 校验失败
            validating: 'glyphicon glyphicon-refresh' // 校验中
          },
          // 配置字段
          fields: {
            // categoryId 分类id
            categoryId: {
              validators: {
                notEmpty: {
                  message: "请选择一级分类"
                }
              }
            },

            // brandName 二级分类名称
            brandName: {
              validators: {
                notEmpty: {
                  message: "请输入二级分类"
                }
              }
            },
            // nramdLogo  图片地址
            brandLogo: {
              validators: {
                notEmpty: {
                  message: "请选择图片"
                }
              }
            }
          }

        })


        // 6. 注册表单校验成功事件,阻止默认提交,通过ajax提交
        $('#form').on("success.form.bv",function(e) {
          e.preventDefault();

          // 通过ajax提交
          $.ajax({
            type: "post",
            url: "/category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function(info) {
              console.log(info);
              if(info.success) {
                // 1. 关闭模态框
                $('#addModal').modal('hide');
                // 2. 重新渲染第一页
                currentPage = 1;
                render();
                // 3. 重置模态框的表单,不仅校验状态要重置,文本内容也要重置
                $('#form').data("bootstrapValidator").resetForm(true);
                // 4. 手动重置文本内容和图片路径
                $('#dropdownText').text("请选择一级分类");
                $('#imgBox img').attr('src',"images/none.png");
              }
            }
          })
        })


 


      }
    })



  })







}) 
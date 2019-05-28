


$(function() {
  var currentPage = 1;
  var pageSize = 5;
  // 1. 一进入页面,发送ajax请求,请求商品数据,通过模板引擎渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
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
          // 配置bootstrap版本
          bootstrapMajorVersion: 3,
          // 当前页
          currentPage: currentPage,
          // 总页数
          totalPages: Math.ceil(info.total / info.size),
          // 修改按钮文字
          // 每个按钮在初始化的时候,都会调用一次这个函数,通过返回值设置文本
          // type: 取值有: page,first,last,prev,next
          // page: 指当前这个按钮所指向的页码
          // current: 表示当前页
          itemTexts: function(type,page,current) {
            switch(type) {
              case "first":
                return "首页" ;
              case "prev":
                return "上一页" ;
              case "next":
                return "下一页" ;
              case "last":
                return "尾页" ;
              case "page":
                return page ;
            }
          },
          // 配置title 提示信息
          // 每个按钮在初始化的时候,都会调用一次这个函数,并且通过返回值设置title文本
          tooltipTitles: function(type,page,current) {
            switch(type) {
              case "first":
                return "首页" ;
              case "prev":
                return "上一页" ;
              case "next":
                return "下一页" ;
              case "last":
                return "尾页" ;
              case "page":
                return "前往第" + page + "页" ;
            }
          },
          // 使用 bootstrap 的提示框组件
          useBootstrapTooltip: true,
          //为按钮绑定点击事件 page:当前点击的按钮值
          onPageClicked: function(a,b,c,page) {
            currentPage = page;
            render();
          }
        })
  
      }
    })
  
  }

  // 2. 点击添加商品按钮,模态框弹出
  $('#addBtn').click(function() {
    $('#addModal').modal('show');
    // 向后台发送ajax请求,获取二级分类数据
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 99
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template('dropdownTpl',info);
        $('#first_ul').html(htmlStr);
      }
    })
  })

  // 3. 给二级菜单下拉框注册事件委托
  $('#first_ul').on("click","a",function() {
    $('#dropdownText').text($(this).text());
    // 将选中的二级菜单所对应的id存起来
    var id = $(this).data('id');
    $('[name="brandId"]').val(id);
    // 手动重置表单校验
    $('#form').data("bootstrapValidator").updateStatus("brandId","VALID");
  })

  // 4. 添加商品表单校验
  $('#form').bootstrapValidator({
     //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
    excluded: [],

    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators:{
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          regexp: {
            regexp: /^[a-zA-Z0-9_\.]+$/,
            message: '尺码格式, 必须是 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      }
    }
  })

  // 5. 文件上传
  $('#uploadImg').fileupload({
    // 配置返回数据格式
    dataType: "json",
    // 图片上传完成后,会调用done回调函数
    done: function(e,data) {
      // 获取上传得到的图片地址
      var imgUrl = data.result.picAddr;
      console.log(imgUrl);
      $('#imgBox img').attr('src',imgUrl)
    }
  })









})
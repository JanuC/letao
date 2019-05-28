


$(function() {
  var currentPage = 1;
  var pageSize = 5;

  // 定义用来存储已上传图片的数组
  var picArr = [];

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
          },
          // 除了非空之外,还必须是非零开头的数字
          regexp: {
            // +: 表示出现一次或者多次
            // \d: 表示数字 0-9
            // *: 表示出现0次或多次
            // ?: 表示出现0次或者1次
            regexp: /^[1-9]\d*$/,
            message: '商品库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          // 尺码,还必须是 xx-xx 的格式,x为数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '尺码必须是xx-xx的格式, 例如32-40'
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
      },
      // 图片校验
      picStatus: {
        validators: {
          notEmpty: {
            message: "请选择三张图片"
          }
        }
      }
    }
  })

  // 5. 文件上传
  // 多文件上传时,插件会遍历选中的图片,发送多次请求到服务器,将来响应多次
  // 每次响应,都会调用一次 done 方法
  $('#uploadImg').fileupload({
    // 配置返回数据格式
    dataType: "json",
    // 图片上传完成后,会调用done回调函数
    done: function(e,data) {
      // data.result 是后台响应的内容
      // 往数组的最前面追加图片对象
      picArr.unshift(data.result);

      // 往 imgBox 最前面追加 img 元素
      $('#imgBox').prepend('<img src="'+ data.result.picAddr +'" width="100">');

      // 通过判断数组长度,如果数组长度大于3,将数组最后一项移除
      if(picArr.length > 3) {

        // 移除数组的最后一项
        picArr.pop();

        // 移除imgBox中图片结构的最后一项
        // $('#imgBox img').eq(-1)
        $('#imgBox img:last-of-type').remove();
      }

      // 如果处理后图片数组的长度为3,那么就通过校验,手动将picStatus置成VALID
      if(picArr.length === 3) {
        $('#form').data("bootstrapValidator").updateStatus("picStatus","VALID");
      }
    }
  })


  // 注册表单校验成功事件,阻止默认提交,通过ajax进行提交
  $('#form').on("success.form.bv",function(e) {
    e.preventDefault();
    // 获取的是表单元素的数据
    var paramsStr = $('#form').serialize();
    // 还需要拼接上图片的数据
    paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: paramsStr,
      dataType: "json",
      success: function(info) {
        console.log(info);
        if(info.success) {
          // 添加成功
          
          // 关闭模态框
          $('#addModal').modal('hide');
          // 页面重新渲染
          currentPage = 1;
          render();
          // 重置表单内容以及校验状态
          $('#form').data('bootstrapValidator').resetForm(true);
          // 下拉列表和图片不是表单元素,需要手动重置
          $('#dropdownText').text("请选择二级分类");
          $('#imgBox img').remove();
        }
      }
    })
  })









})
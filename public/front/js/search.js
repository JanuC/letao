

$(function() {

  // 注意: 要进行本地存储localStorage的操作,进行历史记录管理,
  //       需要约定一个键名, search_list
  //       将来通过 search_list 进行读取或者设置操作

  // 准备假数据: 将下面三行代码在控制台执行
  // var arr = ['耐克','阿迪','阿迪王','新百伦','匡威'];
  // var jsonStr = JSON.stringify(arr);
  // localStorage.setItem('search_list',jsonStr);


  // 功能1: 列表渲染功能
  // (1) 从本地存储中读取历史记录,读取的是jsonStr
  // (2) 转换成数组
  // (3) 通过模板引擎动态渲染

  var arr = getHistory();
  render();



  // 功能2: 点击清空所有,清空所有搜索记录
  // 事件委托
  $('.lt_history').on("click",'.clearAll',function() {

    // 添加mui确认框
    // 参数1: 对话框内容 message
    // 参数2: 对话框标题 title
    // 参数3: 按钮文本数组 btnArr
    // 参数4: 回调函数 callback

    mui.confirm("你确认要清空历史记录吗","温馨提示",["取消","确认"],function(e) {
      if(e.index === 1) {
        // 清除localStorage中的搜索记录
        localStorage.removeItem('search_list');

        render();
      }
    })
 
  });

  // 功能3: 点击历史记录右面的x,清除对应的搜索记录
  $('.lt_history').on("click",'.mui-icon-closeempty',function() {

    mui.confirm("你确认要删除该条记录吗","温馨提示",["取消","确认"],function(e) {
      if(e.index === 1) {
        var str = $(this).siblings().text();

        arr = getHistory();
    
        // arr.indexOf(str) 会返回数组中str对应的下标
        arr.splice(arr.indexOf(str),1);
    
        var jsonStr = JSON.stringify(arr);
    
        localStorage.setItem('search_list',jsonStr);
    
        render();
      }
    }.bind(this))




    
  });


  // 功能4: 新增搜索历史记录
  $('.search_btn').click(function() {
    var val = $('.search_input').val().trim();
    if(val === "") {
      mui.toast("请输入搜索内容");
    }
    // 获取数组
    arr = getHistory();

    // 需求: 
    // 1. 如果有重复的,先将重复的删除,将这项添加到最前面
    // 2. 长度不能超过10个
    var index = arr.indexOf(val);

    if(index != -1) {
      arr.splice(index,1);
    }
    if (arr.length >= 10) {
      // 删除最后一个
      arr.pop();
    }

    arr.unshift(val);
    
    // 转成json,存到本地存储中
    localStorage.setItem("search_list",JSON.stringify(arr));

    render();
    // 清空输入框
    $('.search_input').val('');

    // 添加跳转
    location.href = "searchList.html?key=" + val;
  })









  // 封装的函数


  // 从本地存储中读取历史记录,得到一个数组
  function getHistory() {
    var history = localStorage.getItem('search_list') || '[]'; // json字符串
    var arr = JSON.parse(history);
    return arr;
  }

  // 渲染搜索记录
  function render() {
    arr = getHistory();
    if(!arr || arr.length === 0) {
      console.log(1);
      
      $('.lt_history').html('<p style="padding-left: 100px">没有搜索记录哦~搜索试试吧</p>');
    }else {
      // template(模板id,数据对象)
      var htmlStr = template('historyTpl',{arr: arr});

      $('.lt_history').html(htmlStr);
    }
    
    
  }




})
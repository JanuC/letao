

$(function() {

  // 1. 一进入页面,获取地址栏传过来的参数,并赋值给搜索框
  

  // 调用封装好的方法,得到一个对象
  var key = getSearch("key");

  // 设置给input
  $('.search_input').val(key);

  // 2. 根据搜索关键字发送 ajax请求,进行页面渲染
  render();
  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProduct",
      data: {
        proName: $('.search_input').val(),
        page: 1,
        pageSize: 100
      },
      dataType: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template('tpl',info);
        $('.lt_product').html(htmlStr);
      }
    })
  }

  // 3. 点击搜索功能,实现搜索功能
  $('.search_btn').click(function() {
    
    
    // 需要将搜索关键字追加存储到本地存储中
    var key = $('.search_input').val();

    if(key.trim() === '') {
      alert("请输入搜索关键字");
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
  
 
  







})
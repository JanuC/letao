

// 页面中所有的区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
  indicators: false, //是否显示滚动条
	deceleration: 0.0005 //阻尼系数 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});

// 配置轮播图自动轮播

//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval:5000//自动轮播周期，若为0则不自动播放，默认为0；
});




// 作用: 专门用于解析地址栏参数

function getSearch( k ) {
  // 获取地址栏参数
var search = location.search; // "?name=11&password=123&desc=%E5%B8%85"

// 将其解码成中文
search = decodeURI(search); // "?name=11&password=123&desc=帅"

// 去掉问号
search = search.slice(1); // "name=11&password=123&desc=帅"

// 通过 & 分割成数组
var arr = search.split("&"); // ["name=11","password=123","desc=帅"]

var obj = {};
arr.forEach(function(v,i) {// v表示每一项
  var key = v.split("=")[0]; // name
  var value = v.split("=")[1]; // 11
  // []语法会解析变量
  obj[key] = value;
})
return obj[k];
}

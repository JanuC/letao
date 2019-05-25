$(function() {

  /**
   * 1.进行表单校验
   *  校验要求:
   *    (1) 用户名不能为空,长度为2-6位
   *    (2) 密码不能为空,长度为6-12位
   */

   // 配置的字段和 input 框中指定的 name 关联,所以必须给input加上name
  $('#form').bootstrapValidator({
    // 配置字段
    fields: {
      username: {
        // 配置校验规则
        validators: {
          // 非空
          notEmpty: {
            // 提示信息
            message: "用户名不能为空"
          },
          // 长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: "用户名长度必须为2-6位"
          }
        }
      },
      password: {
        validators: {
          // 非空
          notEmpty: {
            message: "密码不能为空"
          },
          // 长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须为6-12位"
          }
        }
      }
    }
  });


})
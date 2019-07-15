const app = getApp()

Page({
    data: {},

    //注册函数
    doRegist: function (e) {
        var me = this;
        var formObject = e.detail.value;
        var username = formObject.username;
        var password = formObject.password;

        //验证
        if (username.length == 0 || password.length == 0) {
            wx.showToast({
                title: '账号密码不能为空',
                icon: "none",
                duration: 3000
            })
        } else {
            var serverUrl = app.serverUrl;
            wx.showLoading({
                title: '请等待...',
            });

            //微信请求注册接口进行注册  将username 和 password 传给接口
            wx.request({
                url: serverUrl + '/regist', //注册接口路径
                method: "post",
                data: {
                    username: username,
                    password: password
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },

                //调用接口成功时执行 返回的接口在res中
                success: function (res) {
                    console.log(res.data);
                    wx.hideLoading();
                    var status = res.data.status;    //返回的状态码
                    if (status == 200) {
                        wx.showToast({
                            title: '注册成功',
                            icon: "none",
                            duration: 3000
                        }),
                            //app.setGlobalUserInfo(res.data.data);
                            //注册成功页面跳转到 我的
                            wx.redirectTo({
                                url: '../mine/mine',
                            })
                    } else if (status == 500) {
                        wx.showToast({
                            title: res.data.msg,
                            icon: "none",
                            duration: 3000
                        })
                    }
                }
            })
        }
    },

//返回登陆函数
    goLoginPage: function () {
        wx.navigateTo({
            url: '../userLogin/login',
        })
    }
})
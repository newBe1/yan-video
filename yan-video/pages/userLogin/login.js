// pages/userLogin/login.js
const app = getApp()
Page({
    data: {},

    //初始化
    onLoad: function (params) {
        var me = this;
        var redirectUrl = params.redirectUrl;

        if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
            redirectUrl = redirectUrl.replace(/#/g, "?");
            redirectUrl = redirectUrl.replace(/@/g, "=");

            me.redirectUrl = redirectUrl;
        }
    },

    //登陆
    doLogin: function (e) {
        var me = this;
        var formObject = e.detail.value;
        var username = formObject.username;
        var password = formObject.password;

        //验证
        if (username.length == 0 || password.length == 0) {
            wx.showToast({
                title: '用户名密码不能为空',
                icon: "none",
                duration: 3000
            })
        } else {
            var serverUrl = app.serverUrl;
            wx.showLoading({
                title: '请稍等。。。。',
            });
            //调用后端
            wx.request({
                url: serverUrl + '/login',
                method: "post",
                data: {
                    username: username,
                    password: password
                },
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: function (res) {
                    console.log(res.data);
                    if (res.data.status == 200) {
                        //登陆成功
                        wx.hideLoading();
                        wx.showToast({
                            title: '登陆成功',
                            icon: "none",
                            duration: 3000
                        });
                        app.getGlobalUserInfo = res.data.data;
                        var redirectUrl = me.redirectUrl;
                        if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
                            wx.redirectTo({
                                url: redirectUrl,
                            })
                        } else {
                            wx.redirectTo({
                                url: '../mine/mine',
                            })
                        }
                    } else if (res.data.status == 500) {
                        //登陆失败
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
    goRegistPage: function () {
        wx.redirectTo({
            url: '../userRegist/regist',
        })
    }

})
// pages/main/main.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        faceUrl: "../resource/images/noneface.png",
        isMe: true,
        isFollow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {
        var me = this;
        var user = app.getGlobalUserInfo  //全局对象

        var serverUrl = app.serverUrl;
        wx.showLoading({
            title: '请稍等'
        });
        wx.request({
            url: serverUrl + '/user/userInfo?userId=' + user.id,
            method: "POSt",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data);
                wx.hideLoading();
                if (res.data.status == 200) {
                    var userInfo = res.data.data;
                    var faceUrl = "../resource/images/noneface.png";
                    if (userInfo.faceImage != null && userInfo.faceImage != '' && userInfo.faceImage != undefined) {
                        faceUrl = serverUrl + userInfo.faceImage;
                    }
                    me.setData({
                        faceUrl: faceUrl,
                        fansCounts: userInfo.fansCounts,
                        followCounts: userInfo.followCounts,
                        receiveLikeCounts: userInfo.receiveLikeCounts,
                        nickname: userInfo.nickname,
                        isFollow: userInfo.follow
                    })
                } else if (res.data.status == 500) {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 3000,
                        icon: "none",
                        success: function () {
                            wx.redirectTo({
                                url: '../userLogin/login',
                            })
                        }
                    })
                }
            }
        })
    },

    /**
     * 注销登陆
     */
    logout: function () {
        var user = app.getGlobalUserInfo

        var serverUrl = app.serverUrl;
        wx.showLoading({
            title: '请等待...',
        });
        // 调用后端
        wx.request({
            url: serverUrl + '/logout?userId=' + user.id,
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data);
                wx.hideLoading();
                if (res.data.status == 200) {
                    // 登录成功跳转 
                    wx.showToast({
                        title: '注销成功',
                        icon: 'success',
                        duration: 2000
                    });
                    app.getGlobalUserInfo = null;
                    // 注销以后，清空缓存
                    //wx.removeStorageSync("userInfo")
                    // 页面跳转
                    wx.redirectTo({
                        url: '../userLogin/login',
                    })
                }
            }
        })
    },

    //上传头像
    changeFace: function () {
        var me = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: function (res) {
                var tempFilePaths = res.tempFilePaths;
                //console.log(tempFilePaths);//文件的临时路径

                wx.showLoading({
                    title: '上传中...',
                })
                var serverUrl = app.serverUrl;
                // fixme 修改原有的全局对象为本地缓存
                var userInfo = app.getGlobalUserInfo;

                wx.uploadFile({
                    url: serverUrl + '/user/uploadFace?userId=' + userInfo.id,  //app.userInfo.id,
                    filePath: tempFilePaths[0],
                    name: 'file',
                    header: {
                        'content-type': 'application/json', // 默认值
                    },
                    success: function (res) {
                        var data = JSON.parse(res.data);
                        console.log("data =" + data);
                        wx.hideLoading();
                        if (data.status == 200) {
                            wx.showToast({
                                title: '上传成功!~~',
                                icon: "success"
                            });

                            var imageUrl = data.data;
                            me.setData({
                                faceUrl: serverUrl + imageUrl
                            });

                        } else if (data.status == 500) {

                            wx.showToast({
                                title: data.msg
                            });
                        } else if (res.data.status == 502) {
                            wx.showToast({
                                title: res.data.msg,
                                duration: 2000,
                                icon: "none",
                                success: function () {
                                    wx.redirectTo({
                                        url: '../userLogin/login',
                                    })
                                }
                            });

                        }

                    }
                })


            }
        })
    },

    /**
     * 上传作品
     */
    uploadVideo: function () {
        wx.chooseVideo({
            sourceType: ["album"],
            success: function (res) {
                console.log("res=  " + res)
                var duration = res.duration;
                var tmpHeight = res.height;
                var tmpWidth = res.width;
                var tmpVideoUrl = res.tempFilePath;
                var tmpCoverUrl = res.thumbTempFilePath;      //视频封面图片的临时地址

                console.log("duration =" + duration);
                if (duration > 40) {
                    wx.showToast({
                        title: '视频太长',
                        icon: "none",
                        duration: 2000
                    })
                } else if (duration < 1) {
                    wx.showToast({
                        title: '视频太短',
                        icon: "none",
                        duration: 2000
                    })
                } else {
                    wx.navigateTo({
                        url: '../chooseBgm/chooseBgm?duration=' + duration  //将视频的参数传到chooseBgm页
                            + "&tmpHeight=" + tmpHeight
                            + "&tmpWidth=" + tmpWidth
                            + "&tmpVideoUrl=" + tmpVideoUrl
                            + "&tmpCoverUrl=" + tmpCoverUrl
                    })
                }
            }
        })
    }
})
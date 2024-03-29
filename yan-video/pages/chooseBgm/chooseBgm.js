const app = getApp()

Page({
    data: {
        bgmList: [],
        serverUrl: "",
        videoParams: {}
    },

    onLoad: function (params) {  //params为接收的视频对象
        var me = this;
        console.log("params : " + params);
        me.setData({
            videoParams: params
        });
        wx.showLoading({
            title: '请稍等',
        });
        var serverUrl = app.serverUrl;
        var user = app.getGlobalUserInfo;
        wx.request({
            url: serverUrl + '/bgm/queryBgmList',
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: function (res) {
                console.log(res.data);
                wx.hideLoading();
                if (res.data.status == 200) {
                    var bgmList = res.data.data;
                    me.setData({
                        bgmList: bgmList,
                        serverUrl: serverUrl
                    });
                } else if (res.data.status == 502) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: "none",
                        duration: 2000,
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

    upload: function (e) {
        var me = this;
        var bgmId = e.detail.value.bgmId;
        var desc = e.detail.value.desc;

        console.log("bgmId:" + bgmId);
        console.log("desc:" + desc);

        var duration = me.data.videoParams.duration;
        var tmpHeight = me.data.videoParams.tmpHeight;
        var tmpWidth = me.data.videoParams.tmpWidth;
        var tmpVideoUrl = me.data.videoParams.tmpVideoUrl;
        var tmpCoverUrl = me.data.videoParams.tmpCoverUrl;


        // 上传短视频
        wx.showLoading({
            title: '上传中...',
        })
        var serverUrl = app.serverUrl;
        var user = app.getGlobalUserInfo;
        wx.uploadFile({
            url: serverUrl + '/video/upload',
            formData: {
                userId: user.id,
                bgmId: bgmId,
                desc: desc,
                videoSeconds: duration,
                videoHeight: tmpHeight,
                videoWidth: tmpWidth
            },
            filePath: tmpVideoUrl,
            name: 'file',
            header: {
                'content-type': 'application/json', // 默认值
            },
            success: function (res) {
                var data = JSON.parse(res.data);
                wx.hideLoading();
                if (data.status == 200) {
                    var videoId = data.videoId;
                    wx.showToast({
                        title: '上传成功!~~',
                        icon: "success"
                    });
                    wx.navigateBack({
                        delta: 1,
                    })
                    console.log("tmpCoverUrl : " + tmpCoverUrl);
                    // var videoId = data.data;
                    // wx.showLoading({
                    //   title: '上传中...',
                    // })
                    // wx.uploadFile({
                    //   url: serverUrl + '/video/uploadCover',
                    //   formData: {
                    //     userId: app.userInfo.id,
                    //     videoId: videoId
                    //   },
                    //   filePath: tmpCoverUrl,
                    //   name: 'file',
                    //   header: {
                    //     'content-type': 'application/json' // 默认值
                    //   },
                    //   success: function (res) {
                    //     var data = JSON.parse(res.data);
                    //     wx.hideLoading();
                    //     if (data.status == 200) {
                    //       wx.showToast({
                    //         title: '上传成功!~~',
                    //         icon: "success"
                    //       });
                    //       wx.navigateBack({
                    //         delta: 1,
                    //       })
                    //     } else {
                    //       wx.showToast({
                    //         title: '上传失败!~~',
                    //         icon: "success"
                    //       });
                    //     }
                    //   }
                    // })
                } else if (res.data.status == 502) {
                    wx.showToast({
                        title: res.data.msg,
                        duration: 2000,
                        icon: "none"
                    });
                    wx.redirectTo({
                        url: '../userLogin/login',
                    })
                } else {
                    wx.showToast({
                        title: '上传失败!~~',
                        icon: "success"
                    });
                }

            }
        })
    }
})


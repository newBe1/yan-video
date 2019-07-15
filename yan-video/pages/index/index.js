//index.js
//获取应用实例
const app = getApp()

Page({
    data: {
        // 用于分页的属性
        totalPage: 1,
        page: 1,
        videoList: [],

        screenWidth: 350,
        serverUrl: "",
    },
    onLoad: function () {
        var me = this;
        var screenWidth = wx.getSystemInfoSync().screenWidth;   //动态获取宽度
        me.setData({
            screenWidth: screenWidth,
        });

        wx.showLoading({
            title: '请等待。。。',
        })
        var page = me.data.page;
        me.getAllVideos(page);
    },

//封装分页查询
    getAllVideos: function (page) {
        var me = this;
        var serverUrl = app.serverUrl;
        wx.request({
            url: serverUrl + '/video/showAll?page=' + page,
            method: "POST",
            success: function (res) {
                console.log(res.data)
                wx.hideLoading();
                // 判断当前页page是否是第一页，如果是第一页，那么设置videoList为空
                if (page == 1) {
                    me.setData({
                        videoList: []
                    });
                }

                var videoList = res.data.data.rows;  //查询出来的数组
                var newVideoList = me.data.videoList;

                me.setData({
                    videoList: newVideoList.concat(videoList),
                    page: page,
                    totalPage: res.data.data.total,
                    serverUrl: serverUrl
                });

            }
        })
    },
    onPullDownRefresh: function () {
        wx.showNavigationBarLoading();
        this.getAllVideos(1);
    },
    onReachBottom: function () {
        var me = this;
        var currentPage = me.data.page;    //当前页数
        var totalPage = me.data.totalPage; //总页数

        if (currentPage === totalPage) {
            wx.showToast({
                title: '到头额',
                icon: "none"
            })
            return;
        }

        var page = currentPage + 1;
        me.getAllVideos(page);
    }
})

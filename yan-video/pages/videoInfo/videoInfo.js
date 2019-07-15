// pages/videoInfo/videoInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        cover: "cover"
    },
    onLoad: function (options) {

    },
    showSearch: function () {
        wx.redirectTo({
            url: '../showSearch/showSearch',
        })
    }


})
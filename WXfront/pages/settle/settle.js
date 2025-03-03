// pages/settle/settle.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        shopList: [],
        totalMoney: ''
    },

    /**
     * 提交订单
     */
    addOrder() {
        let that = this
        let shopList = this.data.shopList
        var i
        wx.showModal({
            cancelColor: 'cancelColor',
            content: "想好了吗？",
            success(res) {
                if (res.confirm) {
                    for (i = 0; i < shopList.length; i++) {
                        var sname = shopList[i].sname
                        wx.request({
                            url: 'https://www.cyhhyt.xyz/idle/orders',
                            method: "POST",
                            data: {
                                orderCode: shopList[i].uid + "to" + app.globalData.uid + "with" + shopList[i].sid,
                                suid: shopList[i].uid,
                                sid: shopList[i].sid,
                                uid: app.globalData.uid,
                                status: 0,
                                count: shopList[i].selectCount,
                                price: shopList[i].selectCount * shopList[i].price
                            },
                            success(res) {
                                console.log(res)
                                if (res.data.code === 200) {
                                    var oid = res.data.data.oid
                                    var suid = res.data.data.suid
                                    //提醒商家有新订单
                                    wx.request({
                                        url: `https://www.cyhhyt.xyz/idle/orders/remind/${suid}/${oid}`,
                                        method: 'POST'
                                    })
                                } else if (res.data.code !== 200) {
                                    console.log(res)
                                    wx.showToast({
                                        title: `${sname}库存或不足，请联系商家`,
                                    })
                                }

                            },


                        })
                    }
                    if (i === shopList.length) {
                        wx.showModal({
                            cancelColor: 'cancelColor',
                            content: "已提交，请联系商家进行线下交易",
                            success(res) {
                                setTimeout(that.turnMyOrder, 500)
                            }
                        })
                    }
                }
            }
        })
    },
    /**
     * 跳转到我的订单页
     */
    turnMyOrder() {
        wx.navigateTo({
            url: '/pages/myorder/myorder',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var shopList = wx.getStorageSync('jscart'); //取出缓存
        var totalMoney = wx.getStorageSync('totalPrice');
        this.setData({
            shopList: shopList,
            totalMoney: totalMoney
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
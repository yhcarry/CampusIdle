// pages/myorder/myorder.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    orderList0: [],
    orderList1: []
  },

  /**
   * 切换私信与通知
   * @param {currentTab} e 
   */
  clickTab(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  /**
   * 获取订单列表
   * @param {} options 
   */
  getOrderList(status) {
    var that = this
    console.log("执行get" + status)
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/suid/${app.globalData.uid}/${status}`,
      method: "GET",
      success(res) {
        console.log(res)
        if (status === 0) {
          that.setData({
            orderList0: res.data.data
          })
        }
        if (status === 1) {
          that.setData({
            orderList1: res.data.data
          })
        }
      }
    })
  },
  /**
   * 查看订单详情
   * @param {} e 
   */
  gotoOrderDetail(e) {
    var oid = e.currentTarget.dataset.oid
    wx.navigateTo({
      url: `/pages/order/order?oid=${oid}`,
    })
  },
  /**
   * 取消订单
   * @param {} e 
   */
  delete: function (e) {
    console.log(e)
    var that = this
    console.log(app.globalData.uid)
    wx.showModal({
      content: '确定要删除吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `https://www.cyhhyt.xyz/idle/orders/${e.currentTarget.dataset.oid}`,
            method: "DELETE",
            success: (res) => {
              wx.showToast({
                title: '已删除',
                icon: 'success',
                duration: 2000
              })
              that.onLoad()
            }
          })
        } else {

        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList(0)
    this.getOrderList(1)
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
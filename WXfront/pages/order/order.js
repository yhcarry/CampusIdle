// pages/order/order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: {},
    uid: app.globalData.uid,
    phoneNumber:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var uid = wx.getStorageSync('uid')
    this.setData({
      uid:uid
    })
    var oid = options.oid
    var that = this
    //查询订单
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/${oid}`,
      method: "GET",
      success(res) {
        that.setData({
          order: res.data.data
        })
        if (that.data.uid !== res.data.data.suid) {
          wx.request({
            url: `https://www.cyhhyt.xyz/idle/users/${res.data.data.suid}`,
            method:"GET",
            success(res){
              that.setData({
                phoneNumber:res.data.data.phone
              })
            }
          })
        }else{
          wx.request({
            url: `https://www.cyhhyt.xyz/idle/users/${res.data.data.uid}`,
            method:"GET",
            success(res){
              that.setData({
                phoneNumber:res.data.data.phone
              })
            }
          })
        }
      }
    })
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
    })
  },
  /**
   * 联系商家
   */
  gotoContact(e) {
    console.log(e)
    var uid = e.currentTarget.dataset.uid
    wx.navigateTo({
      url: `/pages/chat/chat?uid=${uid}`,
    })
  },
  /**
   * 查询商品
   * @param {} e 
   */
  gotoShop(e) {
    console.log(e)
    var sid = e.target.dataset.sid
    wx.navigateTo({
      url: `/pages/display/display?sid=${sid}`,
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
// pages/information/information.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal:false,
    editType:'',
    inputPhone:'',
    inputQQ:'',
    query: {},
    status: 1,
    user: {},
    orderList1: [],
    num: 4, //后端给的分数,显示相应的星星
    one_1: '',
    two_1: '',
    one_2: 0,
    two_2: 5,
    num: 3,
    uid:app.globalData.uid
  },
  inputChange1(e){
    console.log(e)
    this.setData({
      inputPhone:e.detail.value
    })
  },
  inputChange2(e){
    console.log(e)
    this.setData({
      inputQQ:e.detail.value
    })
  },
  getOrderList() {
    var that = this
    console.log("执行get" + that.data.status)
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/suid/${app.globalData.uid}/${that.data.status}`,
      method: "GET",
      success(res) {
        console.log(res)

        that.setData({
          orderList1: res.data.data
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      query: options
    })
    console.log(this.data.query)
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/users/${options.uid}`,
      method: 'GET',
      success(res) {
        console.log(res)
        that.setData({
          user: res.data.data,
          inputPhone: res.data.data.phone,
          inputQQ:res.data.data.qq
        })
      }
    })
    this.getOrderList()
    //情况一:展示后台给的评分
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/star/${options.uid}`,
      method: "GET",
      success(res) {
        console.log(res)
        that.setData({
          num: res.data.data.toFixed(),
          one_1: res.data.data.toFixed() - 0,
          two_1: 5 - res.data.data.toFixed()
        })
      }
    })
  },
  editQQ: function(e) {
    console.log(e)
    this.setData({
      showModal: true,
      editType:"qq"
    })
  },
  editPhone: function(e) {
    console.log(e)
    this.setData({
      showModal: true,
      editType:"phone"
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm1: function () {
    var that = this
    this.hideModal();
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/users/phone/${that.data.uid}?phone=${that.data.inputPhone}`,
      method:"PUT",
      success(){
        wx.showToast({
          title: '修改成功',
          icon:'success',
          duration:1200
        })
      }
    })
  },
  onConfirm2: function () {
    var that = this
    this.hideModal();
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/users/qq/${that.data.uid}?qq=${that.data.inputQQ}`,
      method:"PUT",
      success(){
        wx.showToast({
          title: '修改成功',
          icon:'success',
          duration:1200
        })
      }
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
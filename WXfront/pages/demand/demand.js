var app = getApp();
Page({

  onPullDownRefresh() {
    this.onShow();
    console.log("上拉刷新");
    wx.showNavigationBarLoading() //在标题栏中显示加载

  },

  getUserInfo: function (e) {
    console.log(e.detail.userInfo)
    wx.request({
      url: app.globalData.url + 'all',
      data: {
        'writer': e.detail.userInfo.nickName,
        'pic': e.detail.userInfo.avatarUrl,
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('submit successs');
        },
        fail: function (res) {
          console.log('submit fail');
        }
      }
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    title: "",
    writer: " ",
    time: "",
    number: "",
    inputValue:'',
    currentPage: 1,
    pageSize: 10,
    total:0
  },
  goTocontactPage(e){
    console.log(e)
    var uid = e.currentTarget.dataset.text.uid
    var nickName = e.currentTarget.dataset.text.username
    wx.navigateTo({
      url: `/pages/chat/chat?uid=${uid}&nickName=${nickName}`,
    })
  },
  /**
   * 搜索
   * @param {搜索关键字} e 
   */
  searchClick(e){
    let that = this
    console.log(e)
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/demands/${that.data.currentPage}/${that.data.pageSize}`,
      method:'GET',
      data:{
        searchName:that.data.inputValue
      },
      success(res){
        that.setData({
          list:res.data.data
        })
      }
    })
  },
  /**
   * 输入事件
   * @param {输入关键字} e 
   */
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value //将input至与data中的inputValue绑定
    })
  },
  /**
   * 清空搜索框,将data的inputValue清空
   * @param {*} e 
   */
  activity_clear(e) {
    this.setData({
      inputValue: '',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/demands/${that.data.currentPage}/${that.data.pageSize}`,
      method:"GET",
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        searchName:this.data.inputValue
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        console.log(res.data);
        that.setData({
          list: res.data.data,
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    })


  },
  tempData: function () {},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/demands/${that.data.currentPage}/${that.data.pageSize}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data:{
        searchName:this.data.inputValue
      },
      success: function (res) {
        //将获取到的json数据，存在名字叫list的这个数组中
        console.log(res.data);
        that.setData({
          list: res.data.data,
          //res代表success函数的事件对，data是固定的，list是数组
        })
      }
    })
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
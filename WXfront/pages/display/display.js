// pages/display/display.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber: '',
    sid: '',
    count: '',
    createTime: '',
    images: [],
    price: '',
    remark: '',
    sname: '',
    dataList: [],
    uid: 6,
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔
    duration: 1000, //滑动动画时长
    url1: '',
    url2: '',
    check: true,
    isCollect: false,

  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.phoneNumber,
    })
  },
  /**
   * 联系商家
   */
  gotoContact() {
    wx.navigateTo({
      url: `/pages/chat/chat?uid=${this.data.uid}`,
    })
  },

  isCollect() {
    var that = this
    console.log(app.globalData.uid)
    //查询是否收藏
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/favorites/isCollect/${app.globalData.uid}/${that.data.sid}`,
      method: "GET",
      success(res) {
        console.log(res)
        that.setData({
          isCollect: res.data.data,
        })
        if (that.data.isCollect) {
          that.setData({
            url1: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/收藏.png',
          })
        } else {
          that.setData({
            url1: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/未收藏.png'
          })
        }
      }
    })

  },
  isCart() {
    var that = this
    console.log("执行isCart")
    //查询是否加入购物车
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/shops/isCart/${app.globalData.uid}/${that.data.sid}`,
      method: "GET",
      success(res) {
        console.log(res)
        that.setData({
          isCart: res.data.data
        })
      }
    })
    console.log(this.data.isCart)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    this.setData({
      sid: options.sid,
    })
    //根据sid获取商品信息
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/shops/${this.data.sid}`,
      method: "GET",
      success: (res => {
        this.setData({
          dataList: res.data.data
        })
        console.log(res.data.data)
        this.setData({
          count: this.data.dataList.count,
          createTime: this.data.dataList.createTime,
          images: this.data.dataList.images,
          price: this.data.dataList.price,
          remark: this.data.dataList.remark,
          sname: this.data.dataList.sname,
          uid: this.data.dataList.uid
        })
        wx.request({
          url: `https://www.cyhhyt.xyz/idle/users/${res.data.data.uid}`,
          method: 'GET',
          success(res) {
            that.setData({
              phoneNumber: res.data.data.phone
            })
          }
        })
      })
    })
    this.isCollect(),
      this.isCart()

  },
  go1() {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  collect() {
    if (!this.data.isCollect) {
      wx.request({
        url: 'https://www.cyhhyt.xyz/idle/favorites',
        method: 'POST',
        data: {
          uid: app.globalData.uid,
          sid: this.data.sid
        }
      })
      this.setData({
        isCollect: true,
        url1: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/收藏.png',
      })
      wx.showToast({
        title: '已收藏',
        duration: 1000
      })
      console.log(this.data.isCollect)
    } else {
      wx.request({
        url: `https://www.cyhhyt.xyz/idle/favorites/${app.globalData.uid}/${this.data.sid}`,
        method: 'DELETE',
      })
      this.setData({
        isCollect: false,
        url1: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/未收藏.png'
      })
      wx.showToast({
        title: '已取消收藏',
        icon: 'none',
        duration: 1000
      })
      console.log(this.data.isCollect)
    }
  },
  //添加购物车
  cart(e) {
    var that = this
    if (that.data.count === 0) {
      wx.showModal({
        cancelColor: 'cancelColor',
        content: "商品库存已不足，请联系商家！"
      })
    } else {
      if (!this.data.isCart) {
        wx.request({
          url: `https://www.cyhhyt.xyz/idle/shops/cart/${app.globalData.uid}/${this.data.sid}`,
          method: "POST",
          success(res) {
            //关闭窗口
            if (res.statusCode === 200) {
              wx.showToast({
                title: '加入购物车成功！',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                isCart: true
              })
            } else {
              wx.showToast({
                title: '添加失败',
                icon: 'error'
              })
            }
          }
        })
      } else {
        wx.showToast({
          title: '该商品已在购物车中',
          icon: 'none'
        })
      }
    }
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
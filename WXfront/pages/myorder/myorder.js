// pages/myorder/myorder.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    orderList0: [],
    orderList1: [],
    showModalStatus: false,
    tatle: "您对这次服务的评价",
    // 星星
    evaluate_contant: ['一', ],
    stars: [0, 1, 2, 3, 4],
    // normalSrc: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/未收藏.png',
    normalSrc: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/评级.png',

    selectedSrc: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/未收藏.png',
    score: 0,
    oid: '',
    scores: {},
    evaluation: '',
    plain: true

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
  // 星星颗数start
  // 提交事件
  submit_evaluate: function (e) {
    var that = this
    console.log(e)
    console.log('评价得分' + this.data.scores)
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/star/${that.data.oid}/${that.data.score}`,
      method: 'PUT'
    })
    this.setData({
      showModalStatus: false
    })
  },
  //点击星
  selectRight: function (e) {
    var score = e.currentTarget.dataset.score
    console.log(score)
    this.data.scores[e.currentTarget.dataset.idx] = score

    let evaluation = score == 1 ? '很不满意' : (score == 2 ? '不满意' : (score == 3 ? '一般' : (score == 4 ? '还不错' : (score == 5 ? '很满意' : ''))))

    this.setData({
      scores: this.data.scores,
      score: score,
      evaluation: evaluation
    })
  },
  // 星星颗数end
  // onLoad: function (options) {
  //   console.log(options.id)
  // },
  showBuyModal(e) {
    this.setData({
      oid: e.currentTarget.dataset.oid
    })
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showModalStatus: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export() // export 方法每次调用后会清掉之前的动画操作。
      })

    }, 200)
  },

  hideBuyModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
      // console.log(this)
    }.bind(this), 200)
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
      url: `https://www.cyhhyt.xyz/idle/orders/uid/${app.globalData.uid}/${status}`,
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
  confirm: function (e) {
    var that = this
    console.log(e)
    wx.showModal({
      content: '是否已收货',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `https://www.cyhhyt.xyz/idle/orders/status/${e.currentTarget.dataset.oid}`,
            method: 'PUT',
            success() {
              //收获完成后删除订单提醒消息
              wx.request({
                url: `http://www.cyhhyt.xyz/idle/orders/remind/${e.currentTarget.dataset.suid}/${e.currentTarget.dataset.oid}`,
                method: 'DELETE',
                success(res){
                  console.log(res)
                }
              })
            }
          })
          that.onLoad()
        }
      }
    })

  },
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
              //删除订单后删除提醒消息
              wx.request({
                url: `http://www.cyhhyt.xyz/idle/orders/remind/${e.currentTarget.dataset.suid}/${e.currentTarget.dataset.oid}`,
                method: 'DELETE',
                success(res){
                  console.log(res)
                }
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
  onShow: function () {},

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
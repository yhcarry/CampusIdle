// app.js
var util = require("./utils/util");
var sotk;

App({
  globalData: {
    statusBarHeight: 0, //状态栏高度
    menuButtonSizeInfo: {}, //胶囊的尺寸，位置信息
    userInfo: {},
    uid: '',
    islogin: '',
    openid: '',
    number: ''
  },
  onLaunch() {
    var that = this
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    var userInfo = wx.getStorageSync('userInfo')
    var uid = wx.getStorageSync('uid')
    var islogin = wx.getStorageSync('islogin')
    var openid = wx.getStorageSync('id')
    this.globalData.userInfo = userInfo
    this.globalData.uid = uid
    this.globalData.openid = openid
    this.globalData.islogin = islogin
    console.log("全局的islogin:" + this.globalData.islogin)
    console.log("全局的uid：" + this.globalData.uid)
    console.log("全局的nickName：" + this.globalData.userInfo.nickName)
    //登录
    if (that.globalData.islogin && ('' != that.globalData.uid)){
      //已登录
    } else {
      //未登录
      wx.showModal({
        title: '温馨提示',
        content: '亲，授权微信登录后才能正常使用小程序功能哦！',
        success(res) {
          if (res.confirm) {
            that.login()
          } else if (res.cancel) {
            wx.showToast({
              title: '您拒绝了请求,不能正常使用小程序',
              icon: 'error',
              duration: 2000
            })
          }
        }
      })
    }



  },
  /**
   * 登录时获取新订单消息
   */
  getOrderMessage(uid) {
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/remind/${this.globalData.uid}`,
      method: 'GET',
      success(res) {
        console.log(res)
        var orderCount = res.data.data
        if (orderCount > 0) {
          wx.showModal({
            cancelColor: 'cancelColor',
            content: "您有" + orderCount + "条新订单请前往【我卖出的】页面查看,并联系客户进行线下交易"
          })
        }
      }
    })
  },
  /**
   * 实现登录
   */
  login() {
    var that = this
    var Gdata = this.globalData
    wx.getUserProfile({
      lang: "zh_CN",
      desc: '展示头像昵称',
      success: (res) => {
        console.log("getUserProfile:" + res)
        Gdata.islogin = true
        Gdata.userInfo = res.userInfo
        wx.setStorageSync('userInfo', res.userInfo)
        wx.setStorageSync('islogin', true)
        //授权获取信息成功，登录获取唯一标识
        wx.login({
          success(res) {
            console.log("执行login成功")
            if (res.code) {
              console.log("执行请求")
              console.log(Gdata.number)
              wx.request({
                url: `https://www.cyhhyt.xyz/idle/users/login?js_code=${res.code}`,
                method: 'GET',
                success(res) {
                  console.log("login():" + res.data.data)
                  Gdata.openid = res.data.data
                  wx.setStorageSync('id', res.data.data)
                  //向后端存入用户信息
                  //查询用户是否存在
                  wx.request({
                    url: `https://www.cyhhyt.xyz/idle/users/isUser/${res.data.data}`,
                    method: 'GET',
                    success(res) {
                      //设置data
                      var data1 = res.data.data
                      console.log("查询用户结果" + data1)
                      if (data1 === null) {
                        //用户不存在，添加用户信息
                        wx.request({
                          url: 'https://www.cyhhyt.xyz/idle/users',
                          method: 'POST',
                          data: {
                            openid: Gdata.openid,
                            username: Gdata.userInfo.nickName,
                            phone: '',
                            avatarUrl: Gdata.userInfo.avatarUrl,
                            qq: ''
                          },
                          success(res) {
                            console.log("添加用户返回的结果" + res)
                            //将返回的用户uid存入缓存
                            Gdata.uid = res.data.data.uid
                            wx.setStorageSync('uid', res.data.data.uid)
                          }
                        })
                      } else {
                        wx.setStorageSync('uid', data1.uid)
                        Gdata.uid = data1.uid
                        console.log(that.globalData.uid)
                      }
                    }
                  })
                }
              })
            }
          }

        })
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '您拒绝了请求,不能正常使用小程序',
          icon: 'error'
        })
      }
    })
  },

  onShow: function (even) {
    var e;
    if (e && e.appid) {
      this.appid = e.appid;
    }
    var that = this
    var res = wx.getSystemInfoSync()
    console.log(res)
    that.globalData.statusBarHeight = res.statusBarHeight
    wx.getMenuButtonBoundingClientRect()
    console.log(that.globalData.statusBarHeight, 'rpx')
    var res1 = wx.getMenuButtonBoundingClientRect();
    that.globalData.menuButtonSizeInfo = res1;
    console.log(res1);
    if (this.globalData.islogin) {
      that.getOrderMessage()
    }

  },


})
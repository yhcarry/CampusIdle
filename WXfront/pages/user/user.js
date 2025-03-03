const app = getApp()
Page({
  data: {
    uid: '',
    openid: '',
    islogin: false,
    userInfo: {},
    statusBarHeight: app.globalData.statusBarHeight,
        menuButtonSizeInfo:app.globalData.menuButtonSizeInfo,
  },

  onLoad(options) {
    var islogin = wx.getStorageSync('islogin');
    var that = this
    console.log(islogin)
    //判断是否登录
    if (islogin&&(''!=app.globalData.uid)) {
      this.setData({
        islogin: islogin
      })
      var openid = wx.getStorageSync('id');
      var userInfo = wx.getStorageSync('userInfo');
      var uid = wx.getStorageSync('uid')
      console.log("用户id为："+uid)
      this.setData({
        openid: openid,
        userInfo: userInfo,
        uid: uid
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '亲，授权微信登录后才能正常使用小程序功能',
        success(res){
          if(res.confirm){
            wx.getUserProfile({
              lang: "zh_CN",
              desc: '展示头像昵称',
              success: (res) => {
                that.setData({
                  userInfo: res.userInfo,
                  islogin: true
                })
                console.log(res)
                wx.setStorageSync('userInfo', res.userInfo)
                app.globalData.userInfo = res.userInfo
                wx.setStorageSync('islogin', true)
                app.globalData.islogin = true
                //授权获取信息成功，登录获取唯一标识
                wx.login({
                  success(res) {
                    console.log(res.code)
                    if (res.code) {
                      wx.request({
                        url:`https://www.cyhhyt.xyz/idle/users/login?js_code=${res.code}`,
                        method:'GET',
                        success(res) {
                          console.log("openid:"+res.data.data)
                          that.setData({
                            openid: res.data.data
                          })
                          wx.setStorageSync('id', res.data.data)
                          app.globalData.openid = res.data.data
                          //向后端存入用户信息
                          //查询用户是否存在
                          wx.request({
                            url: `https://www.cyhhyt.xyz/idle/users/isUser/${res.data.data}`,
                            method: 'GET',
                            success(res) {
                              console.log(res)
                              //设置data
                              var data1 = res.data.data
                              console.log("查询用户结果"+data1)
                              if (data1 === null) {
                                //用户不存在，添加用户信息
                                wx.request({
                                  url: 'https://www.cyhhyt.xyz/idle/users',
                                  method: 'POST',
                                  data: {
                                    openid: that.data.openid,
                                    username:that.data.userInfo.nickName,
                                    phone:'',
                                    avatarUrl:that.data.userInfo.avatarUrl,
                                    qq:''
                                  },
                                  success(res) {
                                    console.log("添加用户返回的结果"+res)
                                    //将返回的用户uid存入缓存
                                    wx.setStorageSync('uid', res.data.data.uid)
                                    app.globalData.uid = res.data.data.uid
                                    that.setData({
                                      uid:res.data.data.uid
                                    })
                                  }
                                })
                              } else {
                                that.setData({
                                  uid: data1.uid
                                })
                                wx.setStorageSync('uid', data1.uid)
                                app.globalData.uid = data1.uid
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
                  title: '您取消了授权登录',
                  icon: 'error'
                })
              }
            })
          }else if(res.cancel){
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
  goto(){
    wx.navigateTo({
      url: `/pages/information/information?uid=${this.data.uid}`,
    })
  },
  clearChaca(){
    this.setData({
      islogin:false,
      userInfo:{},
      uid:'',
      openid:''
    })
    console.log("清除登录信息")
    wx.setStorageSync('islogin', false);
    wx.setStorageSync('id',"");
    wx.setStorageSync('userInfo',"");
    wx.setStorageSync('uid',"")
  },
  /**
   * 获取用户信息并登录
   */
  login() {
    var that = this
    wx.getUserProfile({
      lang: "zh_CN",
      desc: '展示头像昵称',
      success: (res) => {
        that.setData({
          userInfo: res.userInfo,
          islogin: true
        })
        console.log(res)
        wx.setStorageSync('userInfo', res.userInfo)
        app.globalData.userInfo = res.userInfo
        wx.setStorageSync('islogin', true)
        app.globalData.islogin = true
        //授权获取信息成功，登录获取唯一标识
        wx.login({
          success(res) {
            if (res.code) {
              wx.request({
                url:`https://www.cyhhyt.xyz/idle/users/login?js_code=${res.code}`,
                method:'GET',
                success(res) {
                  that.setData({
                    openid: res.data.data
                  })
                  console.log(res)
                  wx.setStorageSync('id', res.data.data)
                  app.globalData.openid = res.data.data
                  //向后端存入用户信息
                  //查询用户是否存在
                  wx.request({
                    url: `https://www.cyhhyt.xyz/idle/users/isUser/${res.data.data}`,
                    method: 'GET',
                    success(res) {
                      console.log(res)
                      //设置data
                      var data1 = res.data.data
                      console.log("查询用户结果"+data1)
                      if (data1 === null) {
                        //用户不存在，添加用户信息
                        wx.request({
                          url: 'https://www.cyhhyt.xyz/idle/users',
                          method: 'POST',
                          data: {
                            openid: that.data.openid,
                            username:that.data.userInfo.nickName,
                            phone:'',
                            avatarUrl:that.data.userInfo.avatarUrl,
                            qq:''
                          },
                          success(res) {
                            console.log("添加用户返回的结果"+res)
                            //将返回的用户uid存入缓存
                            wx.setStorageSync('uid', res.data.data.uid)
                            app.globalData.uid = res.data.data.uid
                            that.setData({
                              uid:res.data.data.uid
                            })
                          }
                        })
                      } else {
                        that.setData({
                          uid: data1.uid
                        })
                        wx.setStorageSync('uid', data1.uid)
                        app.globalData.uid = data1.uid
                      }
                    }
                  })
                }
              })
            }
          }

        })
      },
      fail() {
        wx.showToast({
          title: '您取消了授权登录',
          icon: 'error'
        })
      }
    })
  },

  /**
   * 退出登录
   */
  // exit() {
  //   this.setData({
  //     islogin: false
  //   })
  //   wx.setStorageSync('islogin', false)
  //   wx.setStorageSync('id', '')
  //   wx.setStorageSync('userInfo', {})
  //   wx.setStorageSync('uid', '')
  // },
})
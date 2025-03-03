var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCount: true,
    select: [],
    sids: '', //选中的商品的sid数组
    shopList: [],
    uid: app.globalData.uid,
    isSelect: '',
    selectCount: 1,
    count: 1,
    total: 0,
    count1: 0,
    totalCount: 0,
    totalMoney: 0,
    selectAllStatus: false
  },


  /* 点击减号 */
  bindMinus: function (e) {
    const index = e.currentTarget.dataset.index;
    // let shopList = this.data.shopList;
    console.log(e)
    // this.setData({
    //   count: shopList[index].selectCount
    // });
    console.log("减号：" + this.data.shopList[index].selectCount)
    if (this.data.shopList[index].selectCount <= 1) {
      this.delete(e)
    }
    // this.setData({
    //   count: this.data.selectCount - 1
    // })

    this.data.shopList[index].selectCount = this.data.shopList[index].selectCount - 1;
    if(this.data.shopList[index].selectCount<=0){
      this.data.shopList[index].selectCount=1
    }
    this.setData({
      shopList: this.data.shopList
    })

    // this.setData({
    //   shopList: shopList
    // })
    if (this.data.shopList[index].isSelect) {
      this.getTotalPrice();
    }
  },

  /* 点击加号 */
  bindPlus: function (e) {
    const index = e.currentTarget.dataset.index;
    let shopList = this.data.shopList;
    // let num = carts[index].count;
    console.log(e)
    this.setData({
      count: shopList[index].count
    });
    if (this.data.count == shopList[index].selectCount) {
      wx.showToast({
        title: '数量已达到上线啦',
        icon: 'none'
      })
    } else {
      // this.setData({
      //   count: shopList[index].count + 1
      // })
      shopList[index].selectCount = shopList[index].selectCount + 1
      // if (shopList[index].count - this.data.count >= 0) {
      //   shopList[index].count = this.data.count;
      // }
      this.setData({
        shopList: shopList
      })
    }
    if (this.data.shopList[index].isSelect == true) {
      this.getTotalPrice();
    }
  },

  //计算总价
  getTotalPrice() {
    let shopList = this.data.shopList; // 获取购物车列表
    //重置数据
    this.setData({
      totalCount: 0,
      totalMoney: 0,
      count1: 0,
      total: 0

    })
    for (let i = 0; i < shopList.length; i++) { // 循环列表得到每个数据
      if (shopList[i].isSelect) { // 判断选中才会计算价格
        this.data.total += shopList[i].selectCount * shopList[i].price; // 所有价格加起来
        this.data.count1 += shopList[i].selectCount;
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      shopList: this.data.shopList,
      totalCount: this.data.count1,
      totalMoney: this.data.total.toFixed(2)
    });
  },

  //绑定单选
  bindCheckbox: function (e) {
    var that = this;
    const idx = e.currentTarget.dataset.index;
    let shopList = that.data.shopList;
    const isSelect1 = shopList[idx].isSelect;
    shopList[idx].isSelect = !isSelect1;
    that.setData({
      shopList: shopList,
      selectAllStatus: false
    });
    that.getTotalPrice();
  },


  //绑定多选
  bindSelectAll: function (e) {
    let selectedAllStatus = this.data.selectAllStatus;
    let shopList = this.data.shopList;
    this.data.selectedAllStatus = !this.data.selectedAllStatus;
    for (var i = 0; i < shopList.length; i++) {
      shopList[i].isSelect = this.data.selectedAllStatus;
    }

    this.setData({
      shopList: this.data.shopList,
      selectAllStatus: this.data.selectedAllStatus
    });
    console.log(e)
    this.getTotalPrice();
  },


  //购物车结算
  bindjiesuan: function () {
    var that = this;
    let shopList = that.data.shopList;
    let jscart = [];
    var j = 0
    for (var i = 0; i < shopList.length; i++) {
      if (shopList[i].isSelect) {
        jscart[j] = shopList[i];
        j++;
      }
    }
    if (jscart.length <= 0) {
      wx.showToast({
        title: '未选择商品',
        icon: 'success',
        duration: 1000
      })
      return;
    }
    wx.setStorageSync('jscart', jscart); //存入缓存
    wx.setStorageSync('totalPrice', that.data.totalMoney);
    wx.navigateTo({
      url: '/pages/settle/settle',
    })
  },
  initData: function () {
    var that = this
    wx.request({
      // url: `https://www.cyhhyt.xyz/idle/shops/cart/${this.data.uid}`,
      url: `https://www.cyhhyt.xyz/idle/shops/cart/${app.globalData.uid}`,
      method: 'GET',
      success: (res) => {
        console.log(res)
        this.setData({
          shopList: res.data.data
        })
        this.data.shopList.forEach((item) => {
          console.log(item)
          // list是后台返回的数据
          item.isSelect = false; // r = list[0]的所有数据，这样直接 r.新属性 = 属性值 即可
          item.selectCount = 1;
          that.setData({ // 这里划重点 需要重新setData 下才能js 和 wxml 同步，wxml才能渲染新数据
            shopList: that.data.shopList
          });
        });
      }
    })
    // this.setData({ // 这里划重点 需要重新setData 下才能js 和 wxml 同步，wxml才能渲染新数据
    //   shopList: this.data.shopList
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '购物车',
    })
    this.initData()
  },

  delete: function (e) {
    var that = this
    const idx = e.currentTarget.dataset.index;
    console.log(app.globalData.uid)
    wx.showModal({
      content: '确定要删除吗',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: `https://www.cyhhyt.xyz/idle/shops/cart/${app.globalData.uid}?sids=${that.data.shopList[idx].sid}`,
            method: "DELETE",
            success: (res) => {
              that.data.shopList.splice(idx)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.initData()
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
    //重置数据
    this.setData({
      totalCount: 0,
      totalMoney: 0,
      count1: 0,
      total: 0

    })
    // wx.request({
    //   // url: `https://www.cyhhyt.xyz/idle/shops/cart/${this.data.uid}`,
    //   url: `https://www.cyhhyt.xyz/idle/shops/cart/${app.globalData.uid}`,
    //   method: 'GET',
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       shopList: res.data.data
    //     })
    //   }
    // })
    this.initData()
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
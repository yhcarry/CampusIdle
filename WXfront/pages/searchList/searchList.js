// pages/new/new.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否隐藏搜索历史
    ishidden: false,
    historyList: [],
    focus: false,
    shopList: [],
    currentPage: 1,
    pageSize: 5,
    total: 0,
    isLoading: false,
    inputValue: '',
    lHeight: 0,
    rHeight: 0,
    lList: [],
    rList: [],
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value //将input至与data中的inputValue绑定
    })


  },
  imgLoad: function (e) {
    console.log(e)
    var lList = this.data.lList;
    var rList = this.data.rList;
    var lHeight = this.data.lHeight;
    var rHeight = this.data.rHeight;
    if (lHeight == rHeight || rHeight > lHeight) {
      lList.push(e.currentTarget.dataset.product);
      lHeight += e.detail.height / e.detail.width;
      this.setData({
        lList,
        lHeight
      })
    } else {
      rList.push(e.currentTarget.dataset.product);
      rHeight += e.detail.height / e.detail.width;
      this.setData({
        rList,
        rHeight
      })
    }
  },

  //清除历史记录
  clearHistory(){
    var that = this
    if(that.data.historyList.length>0){
      wx.showModal({
        cancelColor: 'cancelColor',
        title:'提示',
        content:'是否删除历史记录',
        success(res){
          if(res.confirm){
            that.setData({
              historyList:[]
            })
          }else if(res.cancel){
          }
        }
      })
    }else{
      wx.showToast({
        title: '您没有历史记录',
        icon:'none'
      })
    }  
    wx.setStorageSync('history', '[]')
  },
  //点击历史搜索
  onClickHistoryItem(e) {
    this.setData({
      inputValue: e.currentTarget.dataset.text,
      ishidden: true
    })
    this.searchClick()
  },
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value //将input至与data中的inputValue绑定
    })
    if(this.data.historyList.length<1){
      this.setData({
        ishidden:true
      })
    }
    if (this.data.inputValue !== "") {
      this.searchReq()
      this.setData({
        ishidden: true
      })
    } else if(this.data.historyList.length === 0){
      this.setData({
        shopList:[],
        lList:[],
        rList:[]
      })
    }else {
      this.setData({
        shopList:[],
        lList:[],
        rList:[],
        ishidden:false
      })
    }
  },
  //清空搜索框,将data的inputValue清空
  activity_clear(e) {
    this.setData({
      inputValue: '',
      ishidden: false,
      shopList: [],
      lList:[],
      rList:[]
    });
  },
  //点击搜索
  searchClick() {
    if(this.data.inputValue!==""){
       //发送搜索请求
    this.searchReq()
    //设置历史记录数组
    this.setData({
      historyList: this.data.historyList.concat(this.data.inputValue),
    })
    let arr = arrayUnique(this.data.historyList)
    //历史数组反转，最近搜索排在前
    this.setData({
      historyList: arr
    })
    wx.setStorageSync('history', JSON.stringify(this.data.historyList))
    }else{
      wx.showToast({
        title: '请输入商品名称',
        icon:'none',
        duration:2000
      })
    }
    //历史数组去重
    function arrayUnique(arr) {
      var result = [],
        hash = {};
      for (var i = 0, elem;
        (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
          result.push(elem);
          hash[elem] = true;
        }
      }
      return result;
    }
  },
  //搜索时只搜索第一页
  searchReq() {
    var that = this
    var e = {
      flag: false,
      title: "",
      shopList: [],
      total: 0
    }
    this.setData({
      lList: [],
      rList: []
    })
    // 显示loading
    wx.showLoading({
      title: 'Loading...',
    })
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/shops/${this.data.currentPage}/${this.data.pageSize}`,
      method: "GET",
      data: {
        sname: this.data.inputValue,
      },
      success: (res => {
        wx.hideLoading()
        this.setData({
          shopList: res.data.data.records,
          total: res.data.data.total,
        })
        e.shopList = res.data.data.records
        e.total = res.data.data.total

      })
    })
    that.onLoad(e)
  },
  getShopList(cb) {
    var that = this
    this.setData({
      isLoading: true
    })
    //展示loading
    wx.showLoading({
      title: '数据加载中...',
    })
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/shops/${this.data.currentPage}/${this.data.pageSize}`,
      method: 'GET',
      //要发送到服务器的参数
      data: {
        sname: this.data.inputValue
      },
      success: (res) => {
        console.log(res)
        this.setData({
          shopList: [...this.data.shopList, ...res.data.data.records],
          total: res.data.data.total,

        })
      },
      //隐藏loading
      complete: () => {
        wx.hideLoading()
        this.setData({
          isLoading: false,
          shopList: [...this.data.shopList, ...res.data.data.records],
          total: res.data.data.total
        })
        cb && cb()
      },

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      historyList:JSON.parse(wx.getStorageSync('history'))
    })
    console.log(options)
    if (options.flag === false) {
      this.setData({
        query: options,
        shopList: options.shopList,
        total: options.total
      })
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
    //重置数据
    this.setData({
      rList: [],
      lList: [],
      currentPage: 1,
      shopList: [],
      total: 0
    })
    //重新发起请求
    this.getShopList(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('ok')
    if (this.data.currentPage * this.data.pageSize >= this.data.total) {
      //证明没有下一页数据了
      return wx.showToast({
        title: '数据加载完毕！',
        icon: 'none'
      })
    }
    if (this.data.isLoading) return
    this.setData({
      currentPage: this.data.currentPage + 1
    })
    this.getShopList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
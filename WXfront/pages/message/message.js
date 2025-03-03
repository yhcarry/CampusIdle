var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    orderCount:'',
    currentTab: 0,
    addImg: false,
    TaContentList: [],
    TaUid: [],
    array: {},
    num: 0,
    isClose: false,
  },
  /**
   * 切换私信与通知
   * @param {currentTab} e 
   */
  clickTab(e) {
    console.log(e)
    this.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  /**
   * 跳转页面
   * @param {} e 
   */
  goTocontactPage(e) {
    console.log(e)
    var uid = e.currentTarget.dataset.text.sendId
    var nickName = e.currentTarget.dataset.text.nickName
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/messages/${uid}/${app.globalData.uid}`,
      method: "PUT",
      success() {}
    })
    wx.navigateTo({
      url: `/pages/chat/chat?uid=${uid}&nickName=${nickName}`,
    })
  },
  // 页面加载
  onLoad: function () {
  },
  onShow: function (e) {
    var that = this
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/messages/noread/${app.globalData.uid}`,
      method:"GET",
      success(res){
        console.log(res)
        that.setData({
          TaContentList:res.data.data
        })
        var array = that.arrayUid(res.data.data)
        that.setData({
          array
        })
      }
    })
    var that = this
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/orders/remind/${app.globalData.uid}`,
      method:'GET',
      success(res){
        console.log(res)
        that.setData({
          orderCount:res.data.data
        })
      }
    })
  },

  onHide: function () {
  },
  /**
   * 查询数组重复元素的个数
   */
  arrayUid: function (TaContentList) {
    var TaUid = [];
    for (let i = 0; i < TaContentList.length; i++) {
       TaUid.push(TaContentList[i].sendId)
    }
    this.setData({
      TaUid:TaUid
    })

    var arrayUid = []
    var UidCount = []
    var array = {}
    var ListCount = []
    for (let i = 0; i < TaUid.length; i++) {
      var sum = 1
      var Listcount = i
      for (let j = i + 1; j < TaUid.length; j++) {
        if (TaUid[i] === TaUid[j]) {
          sum++,
          Listcount = j
        }
      }
      var count = 0
      for (let m = 0; m < arrayUid.length; m++) {
        if (TaUid[i] === arrayUid[m]) {
          count++
        }
      }
      if (count === 0) {
        arrayUid.push(TaUid[i])
        UidCount.push(sum)
        ListCount.push(Listcount)
      }

    }
    array = {
      arrayUid: arrayUid,
      UidCount: UidCount,
      ListCount: ListCount
    }
    return array
  },

  goToSystemPage(){
    if(this.data.orderCount>0){
      wx.showModal({
        cancelColor: 'cancelColor',
        content:"您有"+this.data.orderCount+"条新订单请前往【我卖出的】页面查看,并联系客户进行线下交易"
      })
    }else{
      
    }
  }
})
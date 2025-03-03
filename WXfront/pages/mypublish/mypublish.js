// components/collect/collect.js
var app = getApp();
Page({
  data: {
    dataList: [],

  },
    gotoShop:function(e){
      var sid = e.currentTarget.dataset.sid
      wx.navigateTo({
        url: `/pages/display/display?sid=${sid}`,
      })
    },
    onLoad: function () {
      wx.request({
        url: `https://www.cyhhyt.xyz/idle/shops/uid/${app.globalData.uid}`, 
        method: "GET",
        success: (res => {
          var dataList = res.data.data
          console.log(res)
          this.setData({
            dataList: dataList
          })
        })
      })
    },
    // 删除发布
    delItem(e) {
      let that = this
      let id = e.currentTarget.dataset.id;
      let sname = e.currentTarget.dataset.sname;
      let type = e.currentTarget.dataset.type;
      let dataList = [...this.data.dataList];
      wx.showModal({
        content:"确定要取消发布吗",
        success(res){
          if(res.confirm){
            wx.request({
              url: `https://www.cyhhyt.xyz/idle/shops/${id}?sname=${sname}&type=${type}`,
              method:"DELETE",
            })
            for (let i = 0; i < dataList.length; i++) {
              const item = dataList[i];
              item.isTouchMove = false;
              if (item.sid === id) {
                dataList.splice(i, 1);
                break;
              }
            }
            that.setData({
              dataList
            })
          }
        }
      })
    },
    /**
     * 修改发布
     */
    edit(e){
      console.log(e)
      var sid = e.currentTarget.dataset.id
      wx.navigateTo({
        url:"/pages/editPublish/editPublish?sid="+sid
      })
      // wx.request({
      //   url: 'https://www.cyhhyt.xyz/idle/shops?images='+ images,
      //   method:"PUT",
      //   data:{
      //   }
      // })
    }
})
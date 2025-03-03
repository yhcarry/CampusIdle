// components/search/search.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    focus: false,
    inputValue: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // bindKeyInput: function (e) {
    //   this.setData({
    //     inputValue: e.detail.value //将input至与data中的inputValue绑定
    //   })
    // },
    // //清空搜索框,将data的inputValue清空
    // activity_clear(e) {
    //   this.setData({
    //     inputValue: ''
    //   });
    // },
    gotoSearch(){
      wx.navigateTo({
        url: '/pages/searchList/searchList'
      })
    }
  }
})
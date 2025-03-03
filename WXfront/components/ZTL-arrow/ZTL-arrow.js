// components/ZTLstyle/TEST.js
const app = getApp() //配置在page对象外面。
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:String
    },

    /**
     * 组件的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        menuButtonSizeInfo:app.globalData.menuButtonSizeInfo,
    },

    /**
     * 组件的方法列表
     */
    methods: {
       goback:function(e){
        wx.navigateBack({
            delta: 1 //返回上一级页面
          })
       }
    }
})

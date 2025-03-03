// custom-tab-bar/index.js
import {storeBindingsBehavior} from 'mobx-miniprogram-bindings'
import {store} from '../store/store'
Component({
    /**
     * 组件的属性列表
     */
    behaviors:[storeBindingsBehavior],
    storeBindings:{
      //数据源
     store,
     fields:{
         //前面是组件映射的，后面是store里面的
         sum:'sum',
         active:'activeTabBarIndex'
     },
     actions:{
      updateActive:'updateActiveTabBarIndex'
     },
      //计算属性
      // get sum(){
      //     return this.numA+this.numB
      // },
  },
  observers:{
    'sum':function(val){
      this.setData({
        'list[3].info':val
      })
    }
  },
    properties: {

    },
    options:{
        styleIsolation:"shared"
    },
    /**
     * 组件的初始数据
     */
    data: {
        "list": [
            {
              "pagePath": "/pages/home/home",
              "text": "主页",
              "iconPath": "/images/tabs/home.png",
              "selectedIconPath": "/images/tabs/home-active.png"
            },
            {
              "pagePath": "/pages/cart/cart",
              "text": "购物车",
              "iconPath": "/images/tabs/shoppedcar.png",
              "selectedIconPath": "/images/tabs/shoppedcar2.png"
            },
            {
              "pagePath": "/pages/publish/publish",
              "text": "发布",
              "iconPath": "/images/tabs/fabu.png",
              "selectedIconPath": "/images/tabs/fabu2.png",
            },
            {
              "pagePath": "/pages/message/message",
              "text": "消息",
              "iconPath": "/images/tabs/message.png",
              "selectedIconPath": "/images/tabs/message-active.png",
            },
            {
              "pagePath": "/pages/user/user",
              "text": "我的",
              "iconPath": "cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/用户.png",
              "selectedIconPath": "cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/用户2.png"
            }
          ],

    },

    
    /**
     * 组件的方法列表
     */
    methods: {
      onChange(event) {
          // event.detail 的值为当前选中项的索引
          //this.setData({ active: event.detail });
          this.updateActive(event.detail)
          wx.switchTab({
            url: this.data.list[event.detail].pagePath,
          })
        },
  }
})

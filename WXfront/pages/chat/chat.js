  // pages/index/to_news/to_news.js  
  var app = getApp();
  var util = require("../../utils/util.js");
  var socketOpen = false;
  var SocketTask;
  var url = `wss://www.cyhhyt.xyz/idle/webSocket/${app.globalData.uid}`;
  var upload_url = '请填写您的图片上传接口地址'
  Page({
    data: {
      arrayList:[],
      content_height: [],
      isClose: false,
      scrollTop: 999,
      user_input_text: '', //用户输入文字
      inputValue: '',
      returnValue: '',
      addImg: false,
      ContentList: [],
      num: 0,
      receiveId: '',
      uid: app.globalData.uid,
      mynickName: app.globalData.userInfo.nickName,
      myavatarUrl: app.globalData.userInfo.avatarUrl,
      usernickName: '',
      useravatarUrl: ' ',
      title: '',
    },
    // 页面加载
    onLoad: function (options) {
      var that = this
      var height = []
      console.log(options)
      that.setData({
        receiveId: options.uid
      })
      wx.request({
        url: `https://www.cyhhyt.xyz/idle/users/${options.uid}`,
        method: "GET",
        success(res) {
          console.log(res.data.data)
          that.setData({
            usernickName: res.data.data.username,
            useravatarUrl: res.data.data.avatarUrl
          })
          wx.setNavigationBarTitle({
            title: that.data.usernickName
          })
        }
      })
      this.getMessage(options.uid)
    },
    getMessage(receiveId){
      var that = this
      wx.request({
        url: `https://www.cyhhyt.xyz/idle/messages/${receiveId}/${app.globalData.uid}`,
        method: "GET",
        success(res) {
          console.log(res)
          that.setData({
            ContentList: res.data.data
          })
          that.get_height(res.data.data)
        }
      })
      that.bottom();
    },
    onShow: function (e) {
      if (!socketOpen) {
        this.webSocket()
      }
    },

    get_height(ContentList) {
      this.setData1(ContentList)
    },
    /**
     * 获取高度
     * @param  ContentList 
     */
    setData1(ContentList) {
      this.data.arrayList=[]
      console.log("执行get_height")
      var that = this
      var height = []
      console.log(ContentList)
      for (let i = 0; i < ContentList.length; i++) {
        var query = wx.createSelectorQuery();
        query.select(`#content_height${i}`).boundingClientRect()
        console.log(query)
        query.exec(function (res) {
          console.log(ContentList[i]);
          console.log(res[0].height);
          height.push(res[0].height + "")
          that.addHeight(ContentList, res[0].height, i)
        })
      }
      that.setData({
        ContentList: ContentList,
        content_height: height
      })

    },
    /**
     * 追加height元素
     */
    addHeight(ContentList, heightList, index) {
      console.log("执行addHeight")
      var that = this
      var list = {
        content: "",
        createTime: '',
        mid: '',
        receiveId: '',
        sendId: '',
        type: '',
        user: '',
        height: ""
      }

      list.content = ContentList[index].content
      list.createTime = ContentList[index].createTime
      list.mid = ContentList[index].mid
      list.receiveId = ContentList[index].receiveId
      list.type = ContentList[index].type
      list.user = ContentList[index].user
      list.sendId = ContentList[index].sendId
      list.height = heightList
      this.data.arrayList.push(list)
      console.log(this.data.arrayList)

      this.setData({
        ContentList: this.data.arrayList
      })
    },
    onUnload: function () {
      console.log("执行onHide")
      this.closeWebSocket()
    },
    closeWebSocket() {
      var that = this
      SocketTask.close({
        success(res) {
          console.log("成功关闭WebSocket" + res)
          that.setData({
            isClose: true,
            socketOpen: false
          })
        }
      })
      console.log("isClose：" + that.data.isClose)
    },
    // 页面加载完成
    onReady: function () {
      console.log("SocketTske:" + SocketTask)
      var that = this;
      SocketTask.onOpen(res => {
        socketOpen = true;
        console.log('监听 WebSocket 连接打开事件。', res)
      })
      SocketTask.onClose(onClose => {
        console.log('监听 WebSocket 连接关闭事件。', onClose)
        socketOpen = false;
        if (!that.data.isClose) {
          this.webSocket()
        }
      })
      SocketTask.onError(onError => {
        console.log('监听 WebSocket 错误。错误信息', onError)
        socketOpen = false
      })
      SocketTask.onMessage(onMessage => {
        console.log('监听WebSocket接受到服务器的消息事件。服务器返回的消息', JSON.parse(onMessage.data))
        var onMessage_data = JSON.parse(onMessage.data)
        var message = {
          content: onMessage_data.content,
          createTime: onMessage_data.createTime,
          mid: '',
          receiveId: onMessage_data.receiveId,
          sendId: onMessage_data.sendId,
          type: onMessage_data.type
        }
        that.data.ContentList.push(message)
        that.setData({
          ContentList: that.data.ContentList
        })
        that.bottom()
      })
    },
    webSocket: function () {
      let that = this
      console.log(that.data.receiveId)
      // 创建Socket
      SocketTask = wx.connectSocket({
        url: url,
        data: 'data',
        header: {
          'content-type': 'application/json'
        },
        method: 'post',
        success: function (res) {
          console.log('WebSocket连接创建', res)
          socketOpen = true
        },
        fail: function (err) {
          wx.showToast({
            title: '网络异常！',
          })
          console.log(err)
        },
      })
    },

    // 提交文字
    submitTo: function (e) {
      console.log(e)
      let that = this;
      var data = {
        content: that.data.inputValue,
        receiveId: that.data.receiveId
      }
      if (socketOpen) {
        // 如果打开了socket就发送数据给服务器
        that.sendSocketMessage(data)
        this.setData({
          inputValue: ''
        })

        that.bottom()
      }
    },
    bindKeyInput: function (e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    gotoInfo(e) {
      console.log(e.currentTarget.dataset.uid)
      var uid = e.currentTarget.dataset.uid
      wx.navigateTo({
        url: `/pages/information/information?uid=${uid}`,
      })
    },
    onHide: function () {
      this.closeWebSocket()
    },

    // 获取hei的id节点然后屏幕焦点调转到这个节点  
    bottom: function () {
      var that = this;
      that.setData({
        scrollTop: 1000000
      })
    },
    sendSocketMessage(msg) {
      var that = this;
      console.log('通过 WebSocket 连接发送数据', JSON.stringify(msg))
      SocketTask.send({
        data: JSON.stringify(msg)
      }, function (res) {
        console.log('已发送', res)
      })
    }
  })
// pages/publish/publish.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shop:{},
    array: ['学习用品', '食品饮料', '日用百货', '服装鞋帽', '电子产品'],
    objectArray: [
      {
        id: 1,
        name: '学习用品'
      },
      {
        id: 2,
        name: '食品饮料'
      },
      {
        id: 3,
        name: '日用百货'
      },
      {
        id: 4,
        name: '服装鞋帽'
      },
      {
        id: 5,
        name: '电子产品'
      }
    ],
    index: "",
    inputValue1: '',
    inputValue2: '',
    inputValue3: '',
    inputValue4: '',
    inputValue5: '',
    inputValue6: '',
    tempFilePaths: [],
    sname: '',
    remark: '',
    price: '',
    type: '',
    count: '',
    image: [],
    show: false,
    state:"publish",
    refreshState: false,
    isSelect:false,//展示类型？
    types:['学习用品', '食品饮料', '日用百货', '服装鞋帽', '电子产品'],//公司/商户类型
    type:"",//公司/商户类型
  },
  onConfirm(event) {
    this.setData({
      index:event.detail.index
    })
    this.onClose()
  },
  taberTop:function(e){
    console.log(e);
    this.setData({
      state: e.currentTarget.dataset.state
    })
  },
  refresh:function(e){
    this.setData({
      refreshState: true
    })
    setTimeout(() =>{
      this.setData({
        refreshState: false
      })
    },2000)
  },
  toBottom(e) {//到底部
    console.log(e)
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
  },
//点击控制下拉框的展示、隐藏
select:function(){
  var isSelect = this.data.isSelect
  this.setData({ isSelect:!isSelect})
},
//点击下拉框选项，选中并隐藏下拉框
getType:function(e){
  let value = e.currentTarget.dataset.type
  this.setData({
    type:value ,
    isSelect: false,
  })
},


  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
    console.log(this.data.array[this.data.index])
  },

  bindKeyInput1(e) {
    this.setData({
      inputValue1: e.detail,
    })
  },
  bindKeyInput2(e) {
    console.log(e)
    this.setData({
      inputValue2: e.detail,
    })
  },
  bindKeyInput3(e) {
    console.log(e)
    this.setData({
      inputValue3: e.detail,
    })
  },
  bindKeyInput4(e) {
    console.log(e)
    this.setData({
      inputValue4: e.detail,
    })
  },
  bindKeyInput5(e) {
    console.log(e)
    this.setData({
      inputValue5: e.detail,
    })
  },
  bindKeyInput6(e) {
    console.log(e)
    this.setData({
      inputValue6: e.detail,
    })
  },

  upload: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancer) {
          if (res.tapIndex == 0) {
            that.chooseWxImageShop('album');
          } else if (res.tapIndex == 1) {
            that.chooseWxImageShop('camera')
          }
        }
      }
    })
  },
  /**
   * 选择图片
   */
  chooseWxImageShop: function (type) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        for (var index in res.tempFilePaths) {
          that.setData({
            tempFilePaths: that.data.tempFilePaths.concat(res.tempFilePaths[index])
          })
          that.upload_file(res.tempFilePaths[index], index)
        }
      }
    })
  },
  /**
   * 上传图片至云端
   * @param {图片路径}} filePath 
   * @param {图片索引} index 
   */
  upload_file: function (filePath, index) {
    wx.cloud.uploadFile({
        cloudPath: "photo/" + Date.now() + ".jpg",
        filePath: filePath,
      })
      .then(res => {
        this.setData({
          image: this.data.image.concat(res.fileID)
        })
        console.log(res)
      })
  },
  /**
   * 预览图片方法
   */
  listenerButtonPreviewImage: function (e) {
    let index = e.target.dataset.index;
    let that = this;
    console.log(that.data.tempFilePaths[index]);
    console.log(that.data.tempFilePaths);
    wx.previewImage({
      current: that.data.tempFilePaths[index],
      urls: that.data.tempFilePaths,
    })
  },
  /**
   * 长按删除图片
   */
  deleteImage: function (e) {
    var that = this;
    var tempFilePaths = that.data.tempFilePaths;
    var image = that.data.image;
    var index = e.currentTarget.dataset.index; //获取当前长按图片下标
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('确定');
          tempFilePaths.splice(index, 1);
          image.splice(index, 1)

        } else if (res.cancel) {
          console.log('取消');
          return false;
        }
        that.setData({
          tempFilePaths,
          image
        });
      }
    })
  },
  submit: function (e) {
    var that = this
    if(((this.data.index+1)&&this.data.inputValue2&& this.data.inputValue6 &&this.data.inputValue3&&this.data.inputValue4&&this.data.inputValue1)-1==-1)
    {
      wx.showToast({
        title: '数据不完善！',
        icon: 'none'
      })
    }
    else{
      if((this.data.image)-1==-1){
        wx.showToast({
          title: '图片还未加载成功！',
          icon: 'none'
        })
      }
      else{
    wx.request({
      url: 'https://www.cyhhyt.xyz/idle/shops?' + "images=" + this.data.image, //接口名称,传入图片数组参数   
      header: {
        'content-type': 'application/json' // 默认值（固定，我开发过程中还没有遇到需要修改header的）   
      },
      method: "PUT", //请求方式    
      data: JSON.stringify({
        sid:this.data.shop.sid,
        sname: this.data.inputValue1,
        remark: this.data.inputValue4,
        price: this.data.inputValue2,
        type: this.data.array[this.data.index],
        count: this.data.inputValue3,
        uid: app.globalData.uid,
        image: this.data.image[0],
      }), //用于存放post请求的参数     
      success(res) {
        console.log(res.data) //成功之后的回调   
      },  
      complete: () => {
         wx.showToast({
          title: '已修改！',
          icon: 'none',
        }),
        this.setData({
          inputValue1:'',
          inputValue2:'',
          inputValue3:'',
          inputValue4:'',
          index:'',
          image:[],
          tempFilePaths:[]
        })//关闭二次触发时执行想要的函数 
      },       
    })
    wx.request({
      url: `http://www.cyhhyt.xyz/idle/users/phone/${app.globalData.uid}?phone=${this.data.inputValue6}`,
      method:"PUT",
      success(){
        that.setData({
          inputValue6:'',
        })
      }
    })
  }
}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this
    that.getPhone()
    console.log(options)
    var sid = options.sid
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/shops/${sid}`,
      method:"GET",
      success(res){
        console.log(res)
        that.setData({
          shop:res.data.data,
          inputValue1:res.data.data.sname,
          inputValue2:res.data.data.price,
          inputValue3:res.data.data.count,

          inputValue4:res.data.data.remark,
          image:res.data.data.images
        })
        that.getIndex(res.data.data.type)
      }
    })
    wx.cloud.init({
      env: 'cloud1-3gybjakse2e4eef5', //云开发环境id
      // env: 'hyt-1g8mkqw60d9f1420', //云开发环境id
      traceUser: true,
    });
  },

  getPhone(){
    var that = this
    wx.request({
      url: `https://www.cyhhyt.xyz/idle/users/${app.globalData.uid}`,
      method:"GET",
      success(res){
        console.log(res)
        that.setData({
          inputValue6:res.data.data.phone
        })
      }
    })
  },
  getIndex(type){
    var that = this
    var types = that.data.types
    for (let i = 0; i <  types.length; i++) {
       if(types[i]===type){
         that.setData({
           index:i
         })
       }
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
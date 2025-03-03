// pages/home/home.js
const app = getApp() //配置在page对象外面。
//data里面声明两个变量，并从globaldata里取值出来。
Page({

    /**
     * 页面的初始数据
     */

    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        menuButtonSizeInfo: app.globalData.menuButtonSizeInfo,
        gridList: [{
                id: 1,
                icon: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/求购.png',
                name: '求购专区',
                url: '/pages/demand/demand',
            },
            {
                id: 2,
                icon: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/教育.png',
                name: '学习用品',
                url: '/pages/new/new',
            },
            {
                id: 3,
                icon: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/食物.png',
                name: '食品饮料',
                url: '/pages/new/new',
            },
            {
                id: 4,
                icon: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/日用.png',
                name: '日用百货',
                url: '/pages/new/new',
            },
            {
                id: 5,
                icon: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/衣服.png',
                name: '服装鞋帽',
                url: '/pages/new/new',
            },
            {
                id: 6,
                icon: 'cloud://cloud1-3gybjakse2e4eef5.636c-cloud1-3gybjakse2e4eef5-1310443580/Photo/电子.png',
                name: '电子产品',
                url: '/pages/new/new',
                active: 1
            },
        ],
        swiperList: [{
                id: 1,
                image: '/images/tabs/message-active.png'
            },
            {
                id: 2,
                image: '/images/tabs/message.png'
            },
        ],
        lHeight: 0,
        rHeight: 0,
        lList: [],
        rList: [],
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔
        duration: 1000, //滑动动画时长
        query: {},
        shopList: [],
        currentPage: 1,
        pageSize: 5,
        total: 0,
        isLoading: false
    },
    imgLoad:function(e){
        console.log(e)
        var lList = this.data.lList;
        var rList = this.data.rList;
        var lHeight = this.data.lHeight;
        var rHeight = this.data.rHeight;
        if (lHeight == rHeight || rHeight > lHeight){
          lList.push(e.currentTarget.dataset.product);
          lHeight += e.detail.height / e.detail.width;
          this.setData({
            lList,
            lHeight
          })
        }else{
          rList.push(e.currentTarget.dataset.product);
          rHeight += e.detail.height / e.detail.width;
          this.setData({
            rList,
            rHeight
          })
        }
      },
  
    getShopList(cb) {
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
            },
            success: (res) => {
                console.log(res)
                this.setData({
                    shopList: [...this.data.shopList, ...res.data.data.records],
                    total: res.data.data.total
                })
            },

            //隐藏loading
            complete: () => {
                wx.hideLoading()
                this.setData({
                    isLoading: false,
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
            query: options
        })
        this.getShopList()

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
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        //重置数据
        this.setData({
            rList:[],
            lList:[],
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
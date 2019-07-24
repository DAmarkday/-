// pages/search/search.js
var app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infor: [],
    inputvalue: '', //搜索框里的获取内容的容器
    showview: true, //判断是否显示view
    hidden:true,
  },
  // 放大图片

  bigger: function (e) {
    var src = e.currentTarget.dataset.src; //获取data-src
    var array = []; //定义数组
    array[0] = src;
   // console.log(src);
    wx.previewImage({
      current: src,
      urls: array[0]
    })
  },

  detail: function (e) {

    var time = e.currentTarget.dataset.src; //获取data-src
    // console.log(title)
    wx.navigateTo({
      url: "../detail/detail?time=" + time, //页面传值
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  b_but: function () {
    var that = this;
    let session = '';
    session = this.data.inputvalue;
    that.setData({
      showview: false, //隐藏最初的view
    });
    that.searchInfo(session);
    session='';
  },

  b_input: function (e) {
    this.setData({
      inputvalue: e.detail.value //将输入的值传入page/data的值
    });
  },
  // 搜索函数
  searchInfo: function (info) {
    this.setData({
      infor: ""
    });
    db.collection('describe').field({
      title: true,
      description:true
    })
      .get({
        success: res => {

          let x = new Array(res.data.length);
          let y = new Array(res.data.length);
          let idArray = new Array();
          let idArray1 = new Array();
          for (let i = 0; i < res.data.length; i++) {
            x[i] = res.data[i].title;
            y[i] = res.data[i].description;
          }
          var r = 0;
          for (let j = 0; j < res.data.length; j++) {
            if (((x[j].indexOf(info)) != -1) ||(( y[j].indexOf(info)) != -1)) {
              idArray[r] = j; //筛选后查找到的所有信息的座位号顺序号
             // console.log(idArray[r]);
              r++;
            }
          }
         //console.log("search");
         
          db.collection('describe').get({
            //如果查询成功的话
            success: res => {
              this.setData({
                infor: ""
              });
             // console.log(this.data.infor);
             // console.log("长度为"+idArray.length);
              for (let p = 0; p < idArray.length; p++) {
                idArray1[p] = res.data[idArray[p]];
               // console.log(idArray[p]);

              };

              this.setData({
                infor: idArray1
              });
             // console.log(this.data.infor);
            }
          });
        }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
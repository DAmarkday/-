// pages/noface/noface.js
const app = getApp()
const db = wx.cloud.database();
Page({
//用于人脸对比
  /**
   * 页面的初始数据
   */
  data: {
   devicePosition:true,
   camera:false,
   cameraContext:{},
    tempImagePath: '',
    pictureID:''

  },
  open: function () {
    this.setData({
      camera: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      camera: true,
      cameraContext: wx.createCameraContext(),
    })
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

  },
 
  // 关闭模拟的相机界面
  close() {
    console.log("关闭相机");
    this.setData({
      camera: false
    })
  },
  camera() {
    let {cameraContext} = this.data;
    // 拍照
    // if (type == "takePhoto") {
      console.log("拍照");
      cameraContext.takePhoto({
        quality: "high",
        success: (res) => {
          // console.log(res);
          this.setData({
            tempImagePath: res.tempImagePath,
            camera: false,
          });
          // wechat.uploadFile("https://xx.xxxxxx.cn/api/upload", res.tempImagePath, "upload")
          //   .then(d => {
          //     console.log(d);
          //   })
          //   .catch(e => {
          //     console.log(e);
          //   })
        },
        fail: (e) => {
          console.log(e);
        }
      })
    },

  face_recognition(){//人脸识别
     
    
  },
  devicePosition() {
    this.setData({
      devicePosition: !this.data.devicePosition,
    })
    console.log("当前相机摄像头为:", this.data.devicePosition ? "后置" : "前置");
  },
  uploadUserPictureProve() {
    wx.showModal({
      title: '提示',
      content: '是否同意对比',
      success: x => {
        if (x.confirm) {
          console.log('用户点击确定');

          wx.showLoading({
            title: '上传中',
          });
          let timestamp = Date.parse(new Date());
          //获取当前时间  
          let n = timestamp;
          let date = new Date(n);
          //年  
          let Y = date.getFullYear();
          //月  
          let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
          //日  
          let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
          //时  
          let h = date.getHours();
          //分  
          let m = date.getMinutes();
          //秒  
          let s = date.getSeconds();

          let nowTimeName = Y + M + D + "_" + h + "_" + m + "_" + s; //获取当前时间来命名

          let that = this; //上传用户照片到未认证的表里接受认证
          if (that.data.tempImagePath != '') {
            return new Promise((resolve, reject) => {
              wx.cloud.uploadFile({
                cloudPath: 'takeoutuserpictureprove/' + nowTimeName + '.jpg', // 上传至云端的路径
                filePath: that.data.tempImagePath, // 小程序临时文件路径
                success: resx => {
                  // 返回文件 ID
                  console.log(resx.fileID);
                  console.log("app "+app.globalData.imageStudentProvePath);
                  that.setData({
                    pictureID: resx.fileID
                  });
                  wx.cloud.callFunction({
                    name: 'judgeUserPicture',
                    data: {
                      fileID1: app.globalData.imageStudentProvePath,
                      fileID2: resx.fileID
                    },
                    success: resy => {
                      // console.log(resy.result);
                      resolve(resy.result);
                    },
                    fail: resy => {
                      wx.hideLoading();
                      setTimeout(function () {
                        wx.showToast({
                          title: '图片错误',
                          image: '/images/x.png'
                        });
                      }, 500);
                      wx.cloud.deleteFile({
                        fileList: [that.data.pictureID],
                        success: res => { },
                        fail: err => { }
                      })
                    }
                  });


                },
                fail: resx => {
                  console.error;
                  wx.hideLoading();
                  setTimeout(function () {
                    wx.showToast({
                      title: '上传失败',
                      image: '/images/x.png'
                    });
                  }, 500);

                }
              })
            }).then(resz => {
              // console.log(resz['Score']);
               //console.log(typeof(resz));
              wx.hideLoading();
              if (resz) { //如果有值传出，则判断分数是不是有60，若有则判断是人，则跳转。
                // let f = resz.indexOf('Score":');
                // let e = resz.indexOf(',"RequestId');

                let score = parseInt((resz['Score']));
                // console.log(score);
                if (score > 50) {
                  console.log(score);
                 
                  let allPages = getCurrentPages();
                  let prevAllPage = allPages[allPages.length - 2];
                  prevAllPage.setData({
                    faceProved: true,
                  });
      
                  wx.cloud.deleteFile({
                    fileList: [that.data.pictureID],
                    success: res => {

                    },
                    fail: err => {

                    }
                  });
                  wx.navigateBack({
                    url: '../detail/detail',
                  });

                } else if (score <= 50) {
                  wx.showToast({
                    title: '照片不符',
                    image: '/images/!.png'
                  });
                  wx.cloud.deleteFile({
                    fileList: [that.data.pictureID],
                    success: res => { },
                    fail: err => { }
                  })
                }
              } else {
                wx.showToast({
                  title: '照片错误',
                  image: '/images/x.png'
                });
                wx.cloud.deleteFile({
                  fileList: [that.data.pictureID],
                  success: res => {

                  },
                  fail: err => {

                  }
                })
              }




            })


          }

        } else if (x.cancel) {
          //点击取消上传
        }
      }
    });
  }

   

})
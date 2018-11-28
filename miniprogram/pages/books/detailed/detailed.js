// pages/books/detailed/detailed.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    info: {},
    content: {},
    file_url:'',
    history_read:"",
    height: '1210rpx',
    isshow: false,
    list: {},
    list_show: true,
    loading_show: false,
    detaild_loading_show: false
  },
  history_skip: function (){
    var self = this
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('history').where({
      article: self.data.file_url
    }).get({
      success: function (res) {
        console.log(res);
        wx.navigateTo({
          url: '../read/read?url=' + res.data[0].chapter + '&file_url=' + self.data.file_url
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.url
    })
    var self = this
    wx.request({
      url: 'http://47.101.163.21:5000/book/detailed?url=' + options.url,
      method: 'GET',
      success: function (response) {
        if (response.statusCode == 200) {
          self.setData({
            info: response.data,
            file_url: options.url,
            detaild_loading_show: true
          })
        }
      }
    })
    wx.request({
      url: 'http://47.101.163.21:5000/book/detailed_read?type=try&url=' + options.url,
      method: 'GET',

      success: function (response) {
        if (response.statusCode == 200) {
          self.setData({
            content: response.data,
            detaild_loading_show: true
            
          })
        }
      }
    })

    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('history').where({
      article: options.url
    }).get({
      success: function (res) {
        self.setData({
          history_read: res.data[0].chapter
        })
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: function (res) {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
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
  show: function () {
    this.setData({
      height:'auto',
      isshow: true
    })
  },
  listshow: function () {
    var self = this
    console.log(self.data.url)
    this.setData({
      list_show: false
    })
    wx.request({
      url: 'http://47.101.163.21:5000/book/detailed_list?url=' + self.data.url,
      method: 'GET',
      success: function(response) {
        if (response.statusCode == 200) {
          if (response.data != '') {
            self.setData({
              list: response.data,
              loading_show: true
            })
          } else{
            var message = [{
              title: '获取目录失败',
              content: [{
                title: '可能由于页面数据动态生成，爬虫无法获取'
              }]
            }]
            self.setData({
              list: message,
              loading_show: true
            })
          }
          console.log(self.data.list)
        }
      }
    })
  },
  listclose: function () {
    this.setData({
      list_show: true
    })
  }
})
// pages/books/read/read.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: {},
    openid:"",
    file_url:"",
    chapter:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this
    wx.request({
      url: 'http://47.101.163.21:5000/book/detailed_read?type=read&url=' + options.url,
      method:'GET',
      success: function (response) {
        if (response.statusCode == 200){
          console.log(response.data)
          self.setData({
            content: response.data,
            file_url:options.file_url
          })
          // 1. 获取数据库引用
          const db = wx.cloud.database()
          // 2. 构造查询语句
          // collection 方法获取一个集合的引用
          // where 方法传入一个对象，数据库返回集合中字段等于指定值的 JSON 文档。API 也支持高级的查询条件（比如大于、小于、in 等），具体见文档查看支持列表
          // get 方法会触发网络请求，往数据库取数据
          console.log("file_url",options.file_url)
          db.collection('history').where({
            article: options.file_url
          }).get({
            success: function(res) {
              if (res.data.length != 0){
                console.log("有", res.data);
                console.log("_id", res.data[0]._id)
                const newchapter = options.url
                db.collection('history').doc(res.data[0]._id).update({
                  data: {
                    chapter: newchapter
                  },
                  success: res => {
                    self.setData({
                      chapter: newchapter
                    })
                  },
                  fail: err => {
                    icon: 'none',
                      console.error('[数据库] [更新记录] 失败：', err)
                  }
                })
              }else{
                console.log("没有", res.data);
                db.collection('history').add({
                  data: {
                    article: options.file_url,
                    chapter: options.url,
                  },
                  success: function (res) {
                    // 在返回结果中会包含新创建的记录的 _id
                    self.setData({
                      counterId: res._id,
                    })
                    console.log('555',self.data.counterId)
                    // wx.showToast({
                    //   title: '新增记录成功',
                    // })
                    console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
                  },
                  fail: function (res) {
                    // wx.showToast({
                    //   icon: 'none',
                    //   title: '新增记录失败'
                    // })
                    console.error('[数据库] [新增记录] 失败：', err)
                  }
                })
              }
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
        }
      }
    })
  },
  
  active: function () {

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
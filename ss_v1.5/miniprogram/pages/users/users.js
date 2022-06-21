// pages/users/users.js
wx.cloud.init();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
   step:"",
   inputvalue:"",
   inputvalue1:"",
   des:"",
   weight:"",
   kcl0:"",        //目标
   kcl1:"",        //当前
   id:""
  },

Input: function(e)
{
  this.setData({
   inputvalue:e.detail.value
  })
 
},
button:function(e)
{
  var des=this.data.inputvalue
 this.setData({
   des:des
 })
console.log(des)
},

button1:function(e)
{
var weight = this.data.inputvalue1
var step2 = this.data.step
var step1 = this.data.des
var kcl0 = 0.6 * step1 * 1.036 * weight / 1000     //目标
var kcl1 = 0.6 * step2 * 1.036 * weight / 1000     //当前 
if(step1==0)
{
  wx.showModal({
    content: '请先输入目标步数',
    showCancel: true,
    title: 'Please',
  })
}
console.log(kcl1)
if(kcl1=="NaN")
{
  this.setData({
    kcl1:0
  })
}
else{
  this.setData({
    kcl1:kcl1
  })
}
this.setData({
  weight:weight,
  kcl0:kcl0,
})
console.log(this.data.kcl0)
},

InputWeight:function(e)
{
this.setData({
  inputvalue1:e.detail.value
})
},

res:function(){
  let that=this;
 
  db.collection('smartshoes').add({
   
  data: {
  //_id: '', // 可选自定义 _id，不填数据库会自动分配
   _id:"123",
   weight:that.data.weight,
   des:that.data.des
  //这里填上传的内容
   
  },
  success: function (res) {
  // res 中有 _id 字段标记刚创建的记录的 id，
  console.log(res)  
  that.setData({
    id:this.data._id,
  }) //在data中新建res保存结果
  }
})

},

res1:function()
{
  db.collection('smartshoes').doc('123').update({
    // data 传入需要局部更新的数据
    data: {
      // 表示将 done 字段置为 true
      weight: this.data.weight,
      des:this.data.des
    },
    success: function(res) {
      console.log(res.data)
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getuserrun()
    this.getshuju()
    this.shuju()
  },
 //定义函数读取用户微信运动数据
 getuserrun() {
   var that=this
  wx.getWeRunData({
    success(res) {
      //由于数据是进行加密的所以我们通过条用云函数的方式进行解密
      wx.cloud.callFunction({
        name: 'step',
        data: {
          weRunData: wx.cloud.CloudID(res.cloudID) // 这个 CloudID 值到云函数端会被替换
        }
      }).then(res=>{
        //console.log(res.result.weRunData.data.stepInfoList[30].step)
        if(res.result.weRunData.data.stepInfoList[30].step == 0)
        {
        that.setData({
          step:"今天还没有开始运动噢！"
        })
      }
      else{
        that.setData({
          step:res.result.weRunData.data.stepInfoList[30].step
        })
      }
      })
    }
  })
  //console.log(that)
},
getshuju:function(){  
  let that=this;
  db.collection('smartshoes').doc('123').get({
    success: function(res) {
      // res.data 包含该记录的数据
      console.log(res.data)
      that.setData({
      des:parseInt(res.data.des),
      weight:parseInt(res.data.weight),

        })
        console.log(that.data.des)
    }
  })
  console.log(that.data)
  
  },
shuju:function()
  {
    var that=this
    console.log(this)
    console.log(that)
    console.log(this.data.weight)
    console.log(that.data.des)
    that.setData({
      kcl0:0.6 * that.data.des * 1.036 * that.data.weight / 1000,
      kcl1:0.6 * that.data.step * 1.036 * that.data.weight / 1000
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})
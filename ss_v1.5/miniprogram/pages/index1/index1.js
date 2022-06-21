//index.js
const app = getApp()
var a = 0;
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    wendu:"",
    shidu:"",
    distance:"",
    timer: null,
  },
  radioChange: function (e) {
    var str = null;
    for (var value of this.data.items) {
      if (value.name === e.detail.value) {
        str = value.value;
        break;
      }
    }
    this.setData({ radioStr: str });
  },
   function1(e) {
    var that = this
    wx.request({
      url: 'https://api.heclouds.com/devices/858906060/datapoints?',
      //设备ID
      //api-key
      header:{
        "api-key":"J8P4fXKY8q7d8E2H8fzALlG74iI="
      },
      data:{
        limit:1
      },
      method :"GET",
      success:function(res){
       // console.log(res)
       that.setData({
         shidu:res.data.data.datastreams[0].datapoints[0].value,
         wendu:res.data.data.datastreams[1].datapoints[0].value,
         distance:res.data.data.datastreams[2].datapoints[0].value,
       }) 
      // console.log(res)  
      }
    })
    var that=this
    var s=that.data.shidu
    var w=that.data.wendu
    var d=that.data.distance
    //console.log(w,s)
   
   //console.log(a)
    if(d<50 && a < 3 )
    {
      this.vibrateLongTap();
      a++;
    //console.log(a)
    }
    
  
  },

  points: function()
  {
    var that=this
    var s=that.data.shidu
    var w=that.data.wendu
    console.log(w,s)
    if(s >0 && w>0){
        if (s > 90 || s<5 ||w>35 ||w<5) {
            wx.showModal({
             title: '警报！',
             content: `当前温湿度不适宜跑步运动`,
             cancelText:"查看详情",
             success (res) {
              if (res.confirm) {
  
              } else if (res.cancel) {
               wx.reLaunch({
                 url: '/pages/index/index',
               })
              }
            }
            })
        }
        else if(s<90 && s>5 && w<35 && w>5 )
        {
         wx.showModal({
           title: '恭喜！',
           content: `当前温湿度适宜跑步运动(仅为室内！若要了解室外请点击查看详情)`,
           cancelText:"查看详情",
           success (res) {
            if (res.confirm) {

            } else if (res.cancel) {
             wx.reLaunch({
               url: '/pages/index/index',
             })
            }
          }
          })
        }
       }

  },

  vibrateLongTap:function(){
    // 使手机振动400ms
    wx.vibrateLong();
  },

  onShow: function(){
        const _this = this
         //定时器  函数赋值给timer  方便clearInterval（）使用
         _this.data.timer = setInterval(
           function () {
          _this.function1();        
          }, 3000);
  
          _this.setData({
            timer:_this.data.timer
          });
  },
 
  onLoad: function(options) {
    this.function1()
  },

})

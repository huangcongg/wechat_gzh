# JS-SDK鉴权流程
## 步骤一：绑定域名
1.微信公众平台进入“公众设置”的“功能设置”里填写“js接口安全域名”。
> 需要实现下载一个MP_verify_CkkLkOrI8NqpLutd.txt文件，放在我们自己填写的域名的静态资源文件夹下去 
> 保证我们可以通过域名路径+MP_verify_CkkLkOrI8NqpLutd.txt的方式可以访问到该文件，已做验证
> 例如：我们想要配置happister.saelinzi.com 域名
> 则我们要保证通过happister.saelinzi.com/MP_verify_CkkLkOrI8NqpLutd.txt 可以访问到服务器上的这个文件

2.IP白名单配置
> 微信公众平台进入“安全中心”的“IP白名单”里填写，跟js-sdk鉴权相关的所有ip
> 新浪云相关ip的位置：文档中心----入口与出口ip----外网访问出口 ip 列表

## 步骤二：引入JS文件
> 在需要调用js接口的页面引入如下js文件，（支持https）：http://res.wx.qq.com/open/js/jweixin-1.4.0.js

## 步骤三：通过config接口注入权限验证配置
> 所有需要使用js-sdk的页面必须先注入配置信息，否则将无法调用
配置项代码如下：
```

wx.config({
  debug: true, // 开启调试模式，调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '自己公众号的APPID', // 必填，公众号的唯一标识
  timestamp: '自己在服务端写一个方法函数生成', // 必填，生成签名的时间戳
  nonceStr: '自己在服务端写一个方法函数生成', // 必填，生成,生成签名的随机串
  signature: '需要跟微信服务器对接', // 必填，签名
  jsApiList: [
    'chooseImage',
    'openLocation',
    'getLocation'
  ] // 必填，需要使用的js接口列表
})
```

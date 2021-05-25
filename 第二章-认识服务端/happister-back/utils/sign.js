let {appid, secret} = require('../config')
let axios = require('axios')
let sha1 = require('sha1')
let ticketModel = require('../db/models/ticketModel')

async function getTicket() { // 获取ticket的方法函数

  let tik_data = await ticketModel.find();
  let access_token = '';
  let ticket = '';
  if(tik_data.length>0){ // 判断数据库是否存储过ticket
  	let t = new Date().getTime() - tik_data[0].token_time;
  	if(t>7000000){ // 是否过期
  		// 重新获取
      await loadData();
      let {_id} = tik_data[0];
      let time = new Date().getTime();
      await ticketModel.update({_id}, { // 更新数据库中已过期的access_token
        access_token,
        token_time:time,
        ticket,
        ticket_time:time
      })
  	}else{
  		access_token = tik_data[0].access_token;
		  ticket = tik_data[0].ticket;
  	}
  }else{
  	//重新获取
    await loadData();
    let time = new Date().getTime();
    await new ticketModel({ //如果是第一次获取access_token，则对数据库进行新增操作
      access_token,
      token_time:time,
      ticket,
      ticket_time:time
    }).save()
  }
  async function loadData(){
    let tokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
    let token_data = await axios.get(tokenUrl)
    // console.log('token_data', token_data.data);
    access_token = token_data.data.access_token // 得到access_token
  
    let ticketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
    let ticket_data = await axios.get(ticketUrl) // 得到jsapi_ticket
    
    ticket =  ticket_data.data.ticket
  }

  return {
    access_token,
    ticket
  }
}


let createNonceStr = function(){
  return Math.random().toString(36).substr(2,15)
}

let createTimestamp =  function(){
  return parseInt(new Date().getTime() / 1000) + ''
}

let sign = async function(url) {
  
  let {ticket} = await getTicket()
  
  let obj = {
    jsapi_ticket: ticket,
    noncestr: createNonceStr(),
    timestamp: createTimestamp(),
    url
  }

  /* 
  1.参与签名的字段包括noncestr（随机字符串）, 有效的jsapi_ticket, timestamp（时间戳）, url（当前网页的URL，不包含#及其后面部分） 。
  2.对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后，
  3.使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1。这里需要注意的是所有参数名均为小写字符。
  4.对string1作sha1加密，字段名和字段值都采用原始值，不进行URL 转义。 
  */
  let str = row(obj)
  let signature = sha1(str) // 生成签名
  obj.signature = signature
  obj.appid = appid
  return obj
}
let row = function(obj) {
  let keys =  Object.keys(obj)
  keys = keys.sort() // 字典排序
  let newObj = {}
  keys.forEach((key)=>{
    newObj[key] = obj[key]
  })
  let string = ''
  for(let k in newObj){
    string += '&' + k +'=' + newObj[k]
  }
  string = string.substr(1)
  return string
}

module.exports = sign

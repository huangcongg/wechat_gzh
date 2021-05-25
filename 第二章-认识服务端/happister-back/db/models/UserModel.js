var mongoose = require('mongoose')

var userSchema = new mongoose.Schema({ // 表结构对象
  user:String,
  pwd:String
})

var UserModel = mongoose.model('userModel', userSchema) // 操作表结构对象的数据模型

module.exports = UserModel
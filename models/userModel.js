const mongoose=require("mongoose");
const Joi=require("joi");
const {config}=require("../config/secretData");
const jwt=require("jsonwebtoken");

const userSchema= new mongoose.Schema({
 name:String,
 email:String,
 password:String,
 date:{
  type: Date, default:Date.now
 },
 role:{
  type: String, default:"regular"
 }
})

exports.UserModel=mongoose.model("users",userSchema);

exports.validUser= (_userBody) => {
 let JoiSchema = Joi.object({
  name:Joi.string().min(1).max(30).required(),
  email:Joi.string().min(7).max(50).email().required(),
  password:Joi.string().min(1).max(5000).required(),
  role:Joi.string().min(1).max(250)
 })
 return JoiSchema.validate(_userBody);
}

exports.validLogIn= (_userBody) => {
 let JoiSchema = Joi.object({
  email:Joi.string().min(7).max(50).email().required(),
  password:Joi.string().min(1).max(5000).required()
 })
 return JoiSchema.validate(_userBody);
}


exports.genToken = (_id) => {
 let token = jwt.sign({_id},config.jwtSecret,{expiresIn:"60mins"});
 return token;
}

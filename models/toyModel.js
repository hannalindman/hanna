const mongoose=require("mongoose");
const Joi=require("joi");

const toySchema= new mongoose.Schema({
 name:String,
 info:String,
 category:String,
 img_url:String,
 price:Number,
 created_date:{
  type: Date, default:Date.now
 },
 user_id:String
})

exports.ToysModel=mongoose.model("toys",toySchema);



exports.validToy= (_toyBody) => {
 let JoiSchema = Joi.object({
  name:Joi.string().min(1).max(30).required(),
  info:Joi.string().min(1).max(30).required(),
  category:Joi.string().min(1).max(30).required(),
  img_url:Joi.string().min(5).max(300),
  price:Joi.number().min(1).max(1000).required()
  
 })
 return JoiSchema.validate(_toyBody);
}
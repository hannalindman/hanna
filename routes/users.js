const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {UserModel, validUser, genToken, validLogIn}=require("../models/userModel");
const _ =require('lodash');
const{authToken}=require('../middlewares/auth')

// router.get('/', async(req, res) => {
//   try {
//     let data=await UserModel.find({},{password:0})
//     res.json(data);
//   }
//   catch(err){
//     console.log(err);
//     res.status(400).json({err:"there is a problem, try again later!"})
//   }
// });


router.get("/myInfo",authToken ,async(req,res) => {
  try{
    let user = await UserModel.findOne({_id:req.userData._id},{pass:0});
    res.json(user);
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})


router.post("/register", async(req, res) => {
  let validate=validUser(req.body);
  if (validate.error){
    return res.status(400).json(validate.error.details)
  }
  try {
    let user= new UserModel(req.body);
    let salt=await bcrypt.genSalt(10);
    user.password=await bcrypt.hash(user.password, salt);
    await user.save();
    res.status(201).json(_.pick(user,["_id", "email", "name", "date"]))
  }
  catch(err){
    console.log(err);
    res.status(400).json({err:"there is a problem, try again later!"})
  }
})



router.post("/login",async(req,res) => {
  let validlogin = validLogIn(req.body);
  if (validlogin.error) {
    return res.status(400).json(validlogin.error.details);
  }
  try{
    let user = await UserModel.findOne({email:req.body.email});
    if(!user){
      return res.status(400).json({msg:"user or password invalid 1"});
    }
    let validPass = await bcrypt.compare(req.body.password,user.password);
    if(!validPass){
      return res.status(400).json({msg:"user or password invalid 2"});  
    }
    let myToken = genToken(user._id);
    res.json({token:myToken});
  }
  catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
})

module.exports = router;



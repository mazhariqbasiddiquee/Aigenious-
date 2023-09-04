const express=require("express")
const userRouter=express.Router()
require('dotenv').config();
const UserModel=require("../model.js/user.model")
const QuestionModel=require("../model.js/question.model")
const bcrypt = require('bcrypt')
const auth=require("../middleware/auth.middleare")
var jwt = require('jsonwebtoken')
const cors=require("cors")

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


userRouter.post("/register",async(req,res)=>{
  //signup
  const {name,email,password}=req.body
  try {
   const user=await UserModel.findOne({email:email})
   if(user){
       res.status(200).json({msg:"User already Exist!!"})
   }else{
       bcrypt.hash(password, 3, async(err, hash)=>{
           // Store hash in your password DB.
           if(err){
               res.status(400).json({error:err.message})  
           }else{
               const user =new UserModel({name,email,password:hash})
               await user.save()
               res.status(200).json({msg:"User has been Registered successfully!!"}) 
           }
       });
   }
   } catch (error) {
   res.status(400).json({error:error.message})
  }
})

userRouter.post("/login",async(req,res)=>{
   //login
   const {email,password}=req.body
   try {
      const user= await UserModel.findOne({email:email})
      if(user){
       bcrypt.compare(password, user.password, function(err, result) {
           // result == true
           if(result){
               var token = jwt.sign({ id:user._id}, 'conpic');
               res.status(200).json({msg:"Login Successfull !!",token:token,user})
           }else{
               res.status(200).json({msg:"Please check your Password !!"})
           }
       });
      }else{
       res.status(200).json({msg:"User doesn't Exist!!"})
      }
   } catch (error) {
      res.status(400).json({error:error.message}) 
   }
})


userRouter.post('/generate-questions', auth,async (req, res) => {
    const userMessage = req.body.prompt; // User's message from request body
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPEN_API}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "system", content: "You are the interviewer. You can ask questions." }, { role: "user", content: userMessage }],
          max_tokens: 1000, // Adjust as needed
        }),
      });
  
      const responseBody = await response.json();
      
      console.log(responseBody)
      
      console.log(responseBody.choices[0].message.content);
      res.json({ text: responseBody.choices[0].message.content});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });


module.exports=userRouter

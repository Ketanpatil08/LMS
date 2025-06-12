const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("home")
});


router.get("/login",(req,res)=>{
     res.render("login.ejs");
});








module.exports=router;


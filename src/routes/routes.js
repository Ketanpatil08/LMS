const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("home")
});


router.get("/login",(req,res)=>{
     res.render("login.ejs");
});


router.get("/userLogin",(req,res)=>{
    res.render("adminDashboard.ejs");
});





module.exports=router;


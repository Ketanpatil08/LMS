let express=require("express");
let session=require("express-session");
let app=express();
let bodyParser=require("body-parser");
let router=require("../src/routes/routes.js");
let conn=require("./config/db.js");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/",router);
app.set("view engine","ejs");




module.exports=app;
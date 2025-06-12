exports.userLogin=(req,res)=>{
    let {username,password}=req.body;
    if(username==="admin" && password==="admin@123")
    {
        res.render('adminDashboard');
    }
    else
    {
        res.render('adminLogin',{error:"Invalid Credentials"});

    }
}
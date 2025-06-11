const mysql=require("mysql2");
require("dotenv").config();

const conn=mysql.createConnection({
    host:process.env.db_HOST,
    user:process.env.db_USER,
    password:process.env.db_PASSWORD,
    database:process.env.db_DATABASE,
    // port:process.env.db_PORT
});

conn.connect((err)=>{
    if(err){
        console.error("Database connection failed:",err.stack);
        return;
    }
    
    console.log("Connected to Database.");
    
});

module.exports=conn;
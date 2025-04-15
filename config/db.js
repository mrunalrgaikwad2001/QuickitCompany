import pg from "pg";
import dotenv from "dotenv";
dotenv.config();
const{DB_URL}=process.env;
const database = new pg.Client({
    connectionString:DB_URL,
    ssl:{
        rejectUnauthorized:false
    }
});

database.connect((err)=>{
    if(err){
        console.log(`Database connection failed:`,err);
    }else{
        console.log(`Connected to the database`);
    }
});

export default database;
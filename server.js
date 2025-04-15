import express from "express";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes.js";
import path from "path";
import{fileURLToPath} from "url";

import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import cors from "cors";
import searchServiceRoutes from "./routes/searchServiceRoutes.js"
dotenv.config();

const app=express();
const PORT=process.env.PORT||4000;
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);


//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"frontend/public")));
app.use(express.json());
app.use(cors({
    origin:"https://www.quickitcompany.com",
    origin:`https://quickitcompany.com`,
    crediantials:true}));

app.use("/contact",contactRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/booking",bookingRoutes);
app.use("/search-service",searchServiceRoutes);
app.use(session({
    secret:"Mrunal08Kiranraj17",
    resave:false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Make user data available to EJS templates
app.use((req,res,next)=>{
    res.locals.user=req.user||null;
    next();
});

app.get("/",(req,res)=>{
    res.render("index.html");
});




//EJS for rendering success message
app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");




//start server
app.listen(PORT,()=>{
    console.log(`Server running on quickitcompany.com`);

});

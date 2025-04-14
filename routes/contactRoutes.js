import express from "express";
import nodemailer from "nodemailer";
import path from "path";
import {fileURLToPath} from "url";
const router=express.Router();

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

//Contact form route
router.post("/submit",async(req,res)=>{
    console.log("Received contact form data:",req.body);
    const {name,email,message}=req.body;
   

    if(!name||!email||!message){
        return res.render("contact-result",{success:false,message:"All fields are required"});
    }

    try{
    //Nodemailer configuration
    const transporter=nodemailer.createTransport({
        service:"Gmail",
        auth:{
            user:"quickitcompany.com@gmail.com",
            pass:"jtwmgsuqsypzqcgb"
        }
    });
    const mailOptions={
        from:email,
        to:"quickitcompany.com@gmail.com",
        subject:`Message from customer: ${name}`,
        text:`Name:${name}\nEmail:${email}\nMessage:${message}`
    };
    
        await transporter.sendMail(mailOptions);
        res.render("contact-result",{success:true,message:"Message sent successfully!We will get back to you soon."});
    }catch(error){
        console.error("Error sending email",error);
        res.render("contact-result",{success:false,message:"Failed to send message.Please try again."});
    }
});

export default router;


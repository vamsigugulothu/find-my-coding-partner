const express = require("express");
const mongoose = require("mongoose");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const userSchema = require("./userSchema");
const middleware = require("./middleware");

mongoose.connect("mongodb+srv://vamsinayak:vamsig@cluster0.2d8evoi.mongodb.net/?retryWrites=true&w=majority").then(
    () => console.log("DB connected")
);

app.get("/",(req,res) => {
    res.send("HELLO WORLD");
})

app.post("/register", async(req,res) => {
    try{
        const { firstname, lastname, email, phone, skills, password, confirmpassword} = req.body;
        const exist = await userSchema.findOne({email});
        if(exist) {
            return res.send("User already exist");
        }
        if(password !== confirmpassword){
            return res.send("Passwords didn't matched");
        }
        let newUser = new userSchema({
            firstname, lastname, email, phone, skills, password, confirmpassword
        })
        newUser.save();
        return res.status(200).send("Registered Successfully",);
    }
    catch(err){
        console.log(err);
        return err;
    }
})

app.post("/login", async(req,res) => {
    try{
        const { email, password } = req.body;
        const exist = await userSchema.findOne({email});
        if(!exist){
            return res.status(400).send("User not exists..please register")
        }
        if(password !== exist.password){
            return res.send("Invalid password");
        }
        let payload = {
            user: {
                id: exist.id
            }
        }
        jwt.sign(payload, "jwtPassword", {expiresIn: 3600000},
        (err, token) => {
            if (err) throw err
            return res.json(token)
        } )
    }
    catch(err){
        console.log(err);
        return err;
    }
})

app.get("/dashboard", middleware, async(req,res) => {
    try{
        const allProfiles = await userSchema.find();
        return res.json(allProfiles);
    }
    catch(err){
        return err;
    }
})

app.listen(5000, ()=> console.log("running"))
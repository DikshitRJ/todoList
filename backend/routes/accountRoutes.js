const router=require('express').Router();
const mongoose = require('mongoose');
require('dotenv').config();
const passport=require('passport');
const passport_init=require('../models/passport-config');
const {MongoClient,ObjectID}=require('mongodb');
const mongodb = new MongoClient("mongodb://localhost:27017/");
const bodyparser=require('body-parser');
const accountsModel=require('../models/accountsModel');
const unverifiedModel=require('../models/unverifiedModel');
const nodemailer=require('nodemailer');
const mailer=require('./mailer');
const URLSearchParams=require('url-search-params');
const express_flash=require('express-flash');
const express_session=require('express-session');
async function connect_mongo() {
    await mongoose.connect('mongodb://localhost:27017/todoList');
}
connect_mongo()
router.use((req, res, next) => {
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    req.params = Object.fromEntries(queryParams);
    next();
  });
  function isNotAuthenticated(req,res,next){
    if (!req.isAuthenticated()){return next()}else{res.redirect('/get')}}
router.use(express_flash());
router.use(express_session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
router.use(passport.initialize());
router.use(passport.session());
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));
router.use(passport_init,async(emailid)=>{
    const accounts = mongodb.db('todoList').collection('accounts');
    const doc=await accounts.findOne({email:emailid});
},async(acid)=>{
    const accounts = mongodb.db('todoList').collection('accounts');
    const doc=await accounts.findOne({id:acid});
})
router.post('/new',isNotAuthenticated,async(req, res)=>{
    res.send('Click the link in the email');
    const unverified = mongodb.db('todoList').collection('unverified');
    console.log(JSON.stringify(req.body));
    const newAccount =new unverifiedModel(req.body);
    await newAccount.validate();
    await newAccount.save();
    const doc=await unverified.findOne({name:newAccount.name});
    let info = await mailer.transporter.sendMail({
        from: '"todoList" <ourledtv@gmail.com>', // sender address
        to: ""+doc.email+"", // list of receivers
        subject: "Verification link ✔", // Subject line
        text: `GoTo: http://${process.env.URL||"localhost:3000"}/account/verify?id=${doc._id.toString()}`, // plain text body
        html: `<b>GoTo: http://${process.env.URL||"localhost:3000"}/account/verify?id=${doc._id.toString()}</b>`, // html body
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
router.get('/get',(req,res,next)=>{
    if (req.isAuthenticated()){return next()}else{res.redirect('/login')}},(req,res)=>{
    res.send(req.user.name);
})
router.post('/login',isNotAuthenticated,passport.authenticate('local',{successRedirect:'/',failiureRedirect:'/login',failiureFlash:true}));
router.get('/verify', isNotAuthenticated,async(req, res) => {
    try{
        const unverified = mongodb.db('todoList').collection('unverified');
        const doc=await unverified.findOne({id:req.params.id});
        const newReal=new accountsModel(doc);
        await newReal.validate();
        await newReal.save();
        await unverified.deleteOne({id:req.params.id})
        console.log("Verified!")
        res.send("Verified!");
    }catch(err){res.send("The link is invalid or is already used")}
});
module.exports = router;
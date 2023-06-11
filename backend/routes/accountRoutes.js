const router=require('express').Router();
const mongoose = require('mongoose');
const {MongoClient,ObjectID}=require('mongodb');
const mongodb = new MongoClient("mongodb://localhost:27017/");
const bodyparser=require('body-parser');
const accountsModel=require('../models/accountsModel');
const unverifiedModel=require('../models/unverifiedModel');
const nodemailer=require('nodemailer');
const mailer=require('./mailer');
const URLSearchParams=require('url-search-params');
async function connect_mongo() {
    await mongoose.connect('mongodb://localhost:27017/todoList');
}
connect_mongo()
router.use((req, res, next) => {
    const queryParams = new URLSearchParams(req.url.split('?')[1]);
    req.params = Object.fromEntries(queryParams);
    next();
  });
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));
router.post('/new',async(req, res)=>{
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
router.get('/verify', async(req, res) => {
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
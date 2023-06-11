const router=require('express').Router();
const mongoose = require('mongoose');
const {MongoClient,ObjectID}=require('mongodb');
const mongodb = new MongoClient("mongodb://localhost:27017/");
const bodyparser=require('body-parser');
const accountsModel=require('../models/accountsModel');
const unverifiedModel=require('../models/unverifiedModel');
const nodemailer=require('nodemailer');
const mailer=require('./mailer');
async function main() {
    await mongoose.connect('mongodb://localhost:27017/todoList');
}
main()
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
        from: '"DikshitRJ" <ourledtv@gmail.com>', // sender address
        to: "ourledtv@gmail.com", // list of receivers
        subject: "Verification link ✔", // Subject line
        text: `GoTo: http://${process.env.URL}/account/verify?id=${doc._id.toString()}`, // plain text body
        html: `<b>GoTo: http://${process.env.URL}/account/verify?id=${doc._id.toString()}</b>`, // html body
    });
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
});
module.exports = router;
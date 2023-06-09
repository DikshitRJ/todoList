const router=require('express').Router();
const mongoose = require('mongoose');
const {MongoClient,ObjectID}=require('mongodb');
const mongodb = new MongoClient("mongodb://localhost:27017/");
const bodyparser=require('body-parser');
const accountsModel=require('../models/accountsModel');
const unverifiedModel=require('../models/unverifiedModel');
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
    console.log(doc._id.toString());
})
module.exports = router;
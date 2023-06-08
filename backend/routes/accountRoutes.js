const router=require('express').Router();
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
const mongoModel=require('../models/mongoModel');
async function main() {
    await mongoose.connect('mongodb://localhost:27017/todoList');
}
main()
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));
router.post('/new',(req, res)=>{
    res.send('Click the link in the email');
    console.log(JSON.stringify(req.body));
    const newAccount =new mongoModel(req.body);
    async function saver(){
    await newAccount.save();}saver();
    console.log(newAccount.name);
})
module.exports = router;
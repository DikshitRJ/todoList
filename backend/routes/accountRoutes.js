const router=require('express').Router();
const mongoose = require('mongoose');
const bodyparser=require('body-parser');
//const model=require('../models/mongoModel');
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));
router.post('/new',(req, res)=>{
    res.send('Click the link in the email');
    console.log(JSON.stringify(req.body));
})
module.exports = router;
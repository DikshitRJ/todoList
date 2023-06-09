const mongo=require('mongodb')
const mongoose=require('mongoose')
const express=require('express')
const mongoSchema=new mongoose.Schema({
    secretId:{
        type:String,
        //required:[true,"secretId not entered"]
    },
    name:{
        type:String,
        required:[true,"name not entered"]
    },
    email:{
        type:String,
        required:[true,"email not entered"]
    },
    phno:{
        type:String,
        required:[true,"phone not entered"]
    },
    pswd:{
        type:String,
        required:[true,"password not entered"]
    }
},({collection:"unverified"}))
const model=new mongoose.model("unverifiedModel",mongoSchema)
module.exports=model
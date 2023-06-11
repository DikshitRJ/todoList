const mongo=require('mongodb')
const mongoose=require('mongoose')
const express=require('express')
const mongoSchema=new mongoose.Schema({
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
    },
    taskArray:{
        type:Array,
        default:[null]
    },
    nextTask:{
        type:Number,
        default:1
    }
},({collection:"accounts"}))
const model=new mongoose.model("accountsModel",mongoSchema)
module.exports=model
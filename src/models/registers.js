const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({

    namee:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        require:true,
        unique:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    address:{
        type:String,
        required:true,
    },
    dateOfJoin:{
        type:String,
        required:true
    },
    dateOfExpire:{
        type:String,
        required:true
    },
    height:{
        type:Number,
        required:true
    },
    weight:{
        type:Number,
        required:true
    },
    bicep:{
        type:Number,
        required:true
    },
    waist:{
        type:Number,
        required:true
    },
    thigh:{
        type:Number,
        required:true
    },

    chest:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    shoulder:{
        type:Number,
        required:true
    },
    hips:{
        type:Number,
        required:true
    },
})

//now we need to cfeate a collections

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
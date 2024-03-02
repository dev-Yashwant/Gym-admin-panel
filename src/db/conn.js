const mongoose = require("mongoose");

const DB = 'mongodb+srv://amanpal58465:aman@cluster0.uxiouvx.mongodb.net/gym?retryWrites=true&w=majority';

mongoose.connect(DB,{
    useNewUrlParser:true,
}).then(()=>{
   console.log('connection succesfullll')
}).catch((error)=>console.log('no connection',error))
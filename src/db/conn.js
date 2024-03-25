const mongoose = require("mongoose");

<<<<<<< HEAD
const DB = 'mongodb+srv://amanpal58465:aman@cluster0.uxiouvx.mongodb.net/gym?retryWrites=true&w=majority';

mongoose.connect(DB,{
    useNewUrlParser:true,
}).then(()=>{
   console.log('connection succesfullll')
}).catch((error)=>console.log('no connection',error))
=======
mongoose.connect("mongodb://localhost:27017/jim", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connection successful');
}).catch((e) => {
    console.log('No connection. Error:', e);
});
>>>>>>> dfcbc1f0cdc79f7351f7e9fbf97d08f6caeb11cc

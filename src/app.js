// MIDLLE WARES AND IMPOTRS
require('dotenv').config();
const express = require ("express");
const bcrypt = require ("bcryptjs");
const app = express();
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser"); 
const session = require('express-session');
const User = require("./models/login");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth")




const DB = 'mongodb+srv://amanpal58465:aman@cluster0.uxiouvx.mongodb.net/gym?retryWrites=true&w=majority';

mongoose.connect(DB,{
    useNewUrlParser:true,
}).then(()=>{
   console.log('connection succesfullll')
}).catch((error)=>console.log('no connection',error))

//require("./db/conn");
const Register = require("./models/registers");
const { request } = require("http");



const port = process.env.PORT || 3000;

//PATH
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");



function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//MIDDELWARE TO SERVE STATIC FILE TO EXPRESS
app.use(express.static(static_path));
app.use(cookieParser());

//SET HANDLEBARS FOR REUSE
app.set("view engine","hbs");
hbs.registerPartials(partials_path);

//SPECIFIC DIRECTORY PATH FOE VIEWS
app.set("views",template_path);

//MIDDLEWARE TO MAKES THE DATA AVAILABLE IN re.body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(static_path));

app.use('/public', express.static(path.join(__dirname, 'public')));

// ROUTES



app.get("/",auth ,(req, res) => {
    res.render("index"); 
});

app.get("/login",auth ,(req, res) => {
    res.redirect("/");
});

app.get("/logout", auth ,(req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((currElement) =>{
            return currElement.token  != req.token
        })

        res.clearCookie("jwt"); 
        res.redirect("login"); 
        
    } catch (error) {
        res.status(500).send(error)
        
    }
    
});

app.get("/memberslists",auth,(req,res) => {
    res.render("memberslists");
})

app.get("/index", auth,(req, res) => {
    res.render("index");
});

app.get("/register",auth, (req, res) => {
    res.render("register"); 
});

app.get("/view" ,auth,(req,res) => {
    res.render("view");
});

app.get("/userview" ,auth,(req,res) => {
    res.render("userview");
});

app.get("/expiredmembers" ,auth,(req,res) => {
    res.render("expiredmembers");
});




app.post("/login",async (req,res) => {
    try{
        const username = req.body.username;
        const password = req.body.password; 
        console.log(req.body.username)
        const user_data = await User.findOne({username:username})   
        const ismatch = await bcrypt.compare(password,user_data.password)
        
        const token = await user_data.generateAuthToken();
        //change date to increse and decrease the days session 
        const days = 30;
        const thirtyDaysInMilliseconds = days * 24 * 60 * 60 * 1000;
        res.cookie("jwt",token,{
            
            expires: new Date(Date.now()+thirtyDaysInMilliseconds ),
            httpOnly:true,
            //secure : true

        })

        

        console.log(token)
        
        if(ismatch){
            
            res.status(201).redirect("/");

        }else{
            res.send("invalid password");

        }

    }

    catch (error) {
        console.error(error);
        res.status(400).json({ error: "login failed" });
    }


});

app.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        const registerEmployee = new Register({
            namee: req.body.namee,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            dateOfJoin: req.body.dateOfJoin,
            dateOfExpire: req.body.dateOfExpire,
            height: req.body.height,
            weight: req.body.weight,
            bicep: req.body.bicep,
            waist: req.body.waist,
            thigh: req.body.thigh,
            chest: req.body.chest,
            age: req.body.age,
            shoulder: req.body.shoulder,
            hips: req.body.hips,
        });

        const registered = await registerEmployee.save();
        console.log("yash");
        res.send('<script>alert("Data successfully registered"); window.location="/index";</script>');
    } catch (error) {
        // Check if the error is a duplicate key error (E11000)
        if (error.code === 11000 && error.keyPattern) {
            // Extract the duplicate key value (phone number or email)
            const duplicateKey = Object.keys(error.keyPattern)[0];
            const duplicateValue = error.keyValue[duplicateKey];
            
            let errorMessage = "";
            if (duplicateKey === "phone") {
                errorMessage = `Phone number ${duplicateValue} already exists. Please use a different phone number.`;
            } else if (duplicateKey === "email") {
                errorMessage = `Email address ${duplicateValue} already exists. Please use a different email address.`;
            }

            return res.status(400).send(`<script>alert("Registration failed. ${errorMessage}"); window.location="/index";</script>`);
        }

        console.error(error);
        res.status(400).json({ error: "Registration failed" });
    }
});


//API TO GAET WHOLE DATA
app.get("/fetchMembersData",auth, async (req, res) => {
  
    try {
        const members = await Register.find({}).lean().exec();
        res.json(members);
        
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
    
});


app.get('/fetchUserData', auth,async (req, res) => {

   
    try {
        const userId = req.query.id;
        console.log(userId,"usder id");
        

        // Fetch user data based on the ObjectId
        const userData = await Register.findOne({ _id: userId }).lean().exec();

        res.json(userData);
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});



app.put('/updateUserData',auth, async (req, res) => {
    try {
        const userId = req.query.id;
        console.log(userId)
        const updatedData = req.body;

        // Update the user data in the database
        await Register.updateOne({ _id: userId}, { $set: updatedData });
        

        res.sendStatus(200);
    } catch (error) {
        console.log(error)
        console.error('Error updating user data:', error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});

app.delete('/deleteUserData',auth,async (req, res) => {
    try {
        const userId = req.query.id;

        // Delete the user data from the database
        await Register.deleteOne({ _id: userId });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting user data:', error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});

app.get("/fetchExpiredMembersData", auth,async (req, res) => {
    try {
        // Get the current date
        const currentDate = new Date().toISOString();

        // Find members whose expiration date is less than the current date
        const expiredMembers = await Register.find({ dateOfExpire: { $lt: currentDate } }).lean().exec();

        res.json(expiredMembers);
    } catch (error) {
        console.error('Error retrieving expired members data:', error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});

app.get("/fetchNewMembers30Data", auth, async (req, res) => {
    try {
        // Calculate the date 30 days ago from today
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Find members who joined in the last 30 days
        const newMembersData = await Register.aggregate([
            {
                $addFields: {
                    dateOfJoin: {
                        $cond: {
                            if: { $eq: [{ $type: "$dateOfJoin" }, "date"] },
                            then: "$dateOfJoin",
                            else: { $toDate: "$dateOfJoin" }
                        }
                    }
                }
            },
            {
                $match: {
                    dateOfJoin: {
                        $gte: thirtyDaysAgo,
                        $lt: new Date() // current date
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateOfJoin" } },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0, // Exclude the default _id field
                    date: "$_id",
                    count: 1
                }
            },
            {
                $sort: { date: 1 } // Sort by date in ascending order
            }
        ]);

        res.json(newMembersData);
    } catch (error) {
        console.error('Error fetching new members data:', error);
        res.status(500).json({ error: "Internal Server Error", message: error.message });
    }
});




app.listen(port, () => {

    console.log(`server is running at port no ${port}`);
    
});


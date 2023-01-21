const express = require("express");
const methodOverride = require("method-override");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const passport = require("passport");
const localStrategy = require("passport-local");
const flash = require("connect-flash");
const User = require('./models/user')

if (process.env.ENVIRONMENT != "prod"){
    require('dotenv').config()
    console.log(process.env.MONGO_URL);
}

const MONGO_URL = process.env.MONGO_URL
mongoose.connect(MONGO_URL, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    console.log("Connected to DB!!");
}).catch(err =>{
    console.log("Error Occured: ",err.message);
});
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({extended: true}));

//Method override for PUT request

app.use(methodOverride('_method'));

//Use flash message
app.use(flash());

// Initialize express-session
app.use(require("express-session")({
    secret: "Prathamesh",
    resave: false,
    saveUninitialized: false
}));


// Initialize passport
app.use(passport.initialize());
app.use(passport.session());


//Adding User to every get route (Runs before the middleware)
app.use((req,res,next) =>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

//Passport and local strategy setup
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new localStrategy(User.authenticate()));


// seedDB();
app.use('/', require('./routes/auth.js'));
app.use('/campground', require('./routes/campgrounds.js'));
app.use('/campground/:id/comment', require('./routes/comments.js'));

port= process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Example app listening at http://localhost:${port}`);
});
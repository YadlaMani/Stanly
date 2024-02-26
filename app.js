//basic setup
if(process.env.NODE_ENV != 'production'){
    require('dotenv').config();
}

const express=require('express');
const mongoose = require('mongoose');
const app=express();
const MONGO_URL=process.env.ATLASDB_URL;
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const { nextTick } = require('process');
const session=require('express-session');
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');

//user models
const User=require("./models/user.js");

const ExpressError=require('./utils/ExpressError.js');




const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

//session
const store=MongoStore.create({
    mongoUrl:MONGO_URL,
    crypto:{
        secret:process.env.SECRET,

    },
    touchAfter:24*3600

})
store.on("error",()=>{
    console.log("Error on mongo store:",err);
})
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized :true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }

}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


main().then(()=>{
    console.log("DB is runing");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}
app.set('view engine','ejs');
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))

app.listen(8080,()=>{
    console.log("listeing on port 8080");
})
//
// app.get('/testListing',async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My new home",
//         description:"Comfy and feel good",
//         price:2500,
//         location:"Hyderabad",
//         country:"India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Sucessfull Testing");

// });

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    res.locals.currUser=req.user;
    next();
});
//index route
app.get('/',async(req,res)=>{
    console.log("working");
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
})

//for ruote for all listing operations
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

//user route

//A default page
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!!!!!"));
})

// Error Handling

app.use((err,req,res,next)=>{
    let {status,message}=err;
    res.status(status).render("./erros.ejs",{message});
    // res.status(status).send(message);
})
app.post('/signup',async(req,res)=>{
    let {username,email}=req.body;
    const newUser=new User({email,username});
   const registeredUser=await  User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){
        req.flash('error',"Invalid details");
    }
     
   res.redirect("/login");
   });
})


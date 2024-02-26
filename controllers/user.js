const User=require("../models/user.js");
module.exports.createUser=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    const newUser=new User({email,username});
   const registeredUser=await  User.register(newUser,password);
   console.log(registeredUser);
   req.login(registeredUser,(err)=>{
    if(err){return next(err);
    }
     req.flash("success","Welcome to Stanly!!");
   res.redirect("/listings");
   });
  
    }
    catch(err){
        res.redirect('/signup');
    }
    
};
module.exports.renderSignup=(req,res)=>{
    res.render("./users/signup.ejs");
};
module.exports.renderLogin=(req,res)=>{
    
    res.render("./users/login.ejs");
};

module.exports.LogoutUser=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are looged out!");
        res.redirect("/listings");
        
    })
};
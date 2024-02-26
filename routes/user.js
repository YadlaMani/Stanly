const express = require('express');
const router =express.Router();
const User=require("../models/user.js");
const WrapAsync = require('../utils/WrapAsync');
const passport=require('passport');
const {saveRedirectUrl}=require('../middleware.js');
const userController=require("../controllers/user.js");
router.get("/signup",userController.renderSignup)
router.post("/signup",WrapAsync(userController.createUser));

router.get("/login",userController.renderLogin);
router.post("/login",saveRedirectUrl,passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome to Stanly");
    let redirectUrl=res.locals.redirectUrl||"/listings";
    res.redirect(redirectUrl);
});
router.get("/logout",userController.LogoutUser);
module.exports=router;
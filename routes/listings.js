const express = require('express');
const router =express.Router();
const Listing=require('../models/listing.js');
const {listingSchema}=require("../schema.js");
const WrapAsync=require('../utils/WrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const flash=require('connect-flash');
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
//for uploading images
const multer  = require('multer')
// const upload=multer({dest:'uploads/'})
const {storage}=require('../cloudConfig.js');
const upload = multer({ storage })
//to validate lising
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            next(new ExpressError(400,error));
        }
        else{
            next();
        }
}
//Index Route
router.get("/",WrapAsync(listingController.index));

//New route
router.get("/new",isLoggedIn,WrapAsync(listingController.renderNewForm));

//Show Route

router.get("/:id",WrapAsync(listingController.renderListing));

//Crate route

router.post("/",upload.single('listing[image]'),isLoggedIn,WrapAsync(listingController.createListing));

//Edit route
router.get("/:id/edit",isLoggedIn,isOwner,WrapAsync(listingController.editListing));

//Update route
router.put("/:id",upload.single('listing[image]'),isLoggedIn,isOwner,WrapAsync(listingController.updateListing));



//Delete route
router.delete("/:id/",isLoggedIn,isOwner,(listingController.deleteListing));



// Error Handling

router.use((err,req,res,next)=>{
    let {status,message}=err;
    res.status(status).render("./erros.ejs",{message});
    // res.status(status).send(message);
})
module.exports=router;

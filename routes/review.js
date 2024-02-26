const express = require('express');
const router =express.Router({mergeParams: true});
const {reviewSchema}=require("../schema.js");
const WrapAsync=require('../utils/WrapAsync.js');
const Review=require('../models/review.js');
const ExpressError=require('../utils/ExpressError.js');
const Listing=require('../models/listing.js');
const {isLoggedIn,isreviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/reviews.js");
//to validate review

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error){
            next(new ExpressError(400,error));
        }
        else{
            next();
        }
    }

    
//Reviews post route

router.post("/",isLoggedIn,WrapAsync(reviewcontroller.postReview));
//Delte route for reviews
router.delete("/:reviewid",isreviewAuthor,WrapAsync(reviewcontroller.deleteReview));

module.exports=router;
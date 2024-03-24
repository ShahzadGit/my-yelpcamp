import Campground from "../models/campground.js";
import Review from "../models/review.js";

const isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo =  req.originalUrl;
        req.flash('error', 'You must first login');
        return res.redirect('/login')
    }
    next();
}
const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isAuthor = async(req, res, next)=>{
    //For checking authorization, current user is compared to the camp owned by author
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp.author._id.equals(req.user._id)){
     req.flash('error', 'You do not have permissions!');
     // res.redirect(`campgrounds/${id}`);   //This path is not working in PUT and DELETE But works fine in GET and POST
     if(req.method === 'GET'){
        return res.redirect(`/campgrounds/${id}`);  
     }else{
        return res.redirect(`${id}`);  
     }
    }
    //
    next() ;
}

const isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author._id.equals(req.user._id)){
        req.flash('error', "You do not have permissions!");
        return res.redirect(`/campgrounds/${id}`);
    }
    // res.redirect(`campgrounds/${id}`);   //This path is not working in PUT and DELETE But works fine in GET and POST
    next() ;
}

export {isLoggedIn, storeReturnTo, isAuthor,isReviewAuthor}; 
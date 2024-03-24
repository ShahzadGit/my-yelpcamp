import Campground from "../models/campground.js";
import Review from "../models/review.js";

const addReview = async(req, res)=>{
    const {id} = req.params;
    const camp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', "Successfully created a new Review...");
    res.redirect(`/campgrounds/${camp.id}`);
}

const deleteReview = async(req, res)=>{
    const {id, reviewId} = req.params;
    // $pull operator removes from an array all values that match a specified condition
    await Campground.findByIdAndUpdate(id, {$pull:{reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully deleted a Review...");
    res.redirect(`/campgrounds/${id}`);
}

export {addReview, deleteReview};
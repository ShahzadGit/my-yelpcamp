import express from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { validateReview } from "../utils/validateSchema.js";
import { isLoggedIn, isReviewAuthor } from "../utils/middleware.js";
import { addReview, deleteReview } from "../controllers/reviews.js";
// We need to set mergeParams: true so that to grab the params in url, else it would return a null params
const reviewRoutes = express.Router({mergeParams: true});

reviewRoutes.post("/",isLoggedIn, validateReview,catchAsync(addReview))
  
reviewRoutes.delete("/:reviewId",isLoggedIn,isReviewAuthor, catchAsync(deleteReview))

export default reviewRoutes;


import mongoose from "mongoose";
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author:{
    type: Schema.Types.ObjectId,
    ref: "YelpUser",
  }
  
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;

// author: {
//   type: Schema.Types.ObjectId,
//   ref: "User",
// },
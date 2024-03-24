import mongoose from "mongoose";
import Review from "./review.js";
const Schema = mongoose.Schema;
const opts = { toJSON: {virtuals: true}};

const ImageSchema = new Schema({
    url: String,
    filename: String,
})
const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  description: String,
  images:[ImageSchema],
  location: String,
  geometry:{
    type:{
      type: String,
      enum:['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  author:{
    type: Schema.Types.ObjectId,
    ref: "YelpUser",
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  }]
},opts);

CampgroundSchema.post('findOneAndDelete', async(doc)=>{
  if(doc){
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200');
})

CampgroundSchema.virtual('properties.popupMarkup').get(function(){
  return `<a href="/campgrounds/${this.id}">${this.title}</a>`
})

const Campground = mongoose.model("Campground", CampgroundSchema);
export default Campground;

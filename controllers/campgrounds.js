import { cloudinary } from "../config/cloudinary.js";
import Campground from "../models/campground.js";
import { AppError } from "../utils/AppError.js";
import mbxGeocoding from "@mapbox/mapbox-sdk/services/geocoding.js";

const mapboxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapboxToken});


const allCampgrounds = async (req, res) => {
    const camps = await Campground.find();
    res.render("campgrounds/index", { camps });
}

const newCampground = (req, res) => {
    res.render("campgrounds/new");
}

const renderEditCampgroundForm = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render("campgrounds/edit", { camp });
}

const showCampgroundAndReview = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
      path: 'reviews',
      populate: ({path:'author'})    
  }).populate('author');
    if(!camp){
      req.flash('error', 'No Campground found against this id');
      res.redirect("/campgrounds");
    }else{
      res.render("campgrounds/show.ejs", { camp });        
    }  
}

const addCampground = async (req, res, next) => {
    // if (!req.body.campground) throw new AppError("Invalid Data", 400);
    // ////////
    const geoData = await geoCoder.forwardGeocode({
      query: req.body.campground.location,
      limit: 1
    }).send()
    /////////////////// 
    const { title, price, description, location } = req.body.campground;
    const author = req.user._id;
    const camp = new Campground({ title, price, description, location, author });
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map((f) => ({url: f.path, filename: f.filename}))
    await camp.save();
    req.flash('success', "Successfully added a campground");
    res.redirect(`campgrounds/${camp.id}`);
}

const updateCampgroun = async (req, res) => {
    if (!req.body.campground) throw new AppError("Invalid Data", 400);
    const { title, price, description, location } = req.body.campground;
    const { id } = req.params;
    const imgs = req.files.map((f) => ({url: f.path, filename: f.filename}))
    const camp = await Campground.findByIdAndUpdate(id, {
      title,
      price,
      description,
      location,
    });
    camp.images.push(...imgs);
    await camp.save();

    //This will delete images in cloudinary
    if(req.body.deleteImages){
      for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename);
      }
      await camp.updateOne({$pull:{images: {filename: req.body.deleteImages}}})
      console.log("UpdateCampgroun ~ camp:", camp)
      
    }
    req.flash('success', "Successfully Updated a campground");
    // res.redirect(`campgrounds/${id}`);   //This path is not working in PUT and DELETE But works fine in POST
    res.redirect(`${id}`);
}

const deleteCampground = async (req, res) => {
    const { id } = req.params;
    const dVal = await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted a Campground...");
    // res.redirect(`campgrounds/${id}`);   //This path is not working in PUT and DELETE But works fine in POST
    res.redirect("/campgrounds");
}
export {allCampgrounds, newCampground, renderEditCampgroundForm, showCampgroundAndReview, addCampground, updateCampgroun, deleteCampground}; 
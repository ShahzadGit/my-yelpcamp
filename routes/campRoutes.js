import express from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { validateCampground } from "../utils/validateSchema.js";
import {isAuthor, isLoggedIn} from "../utils/middleware.js";
import { allCampgrounds, 
        renderEditCampgroundForm, 
        newCampground, 
        showCampgroundAndReview, 
        addCampground, 
        updateCampgroun, deleteCampground } from "../controllers/campgrounds.js";
const campRoutes = express.Router();
import multer from "multer";
import { storage } from "../config/cloudinary.js";

// const upload = multer({dest: 'uploads/'});
const upload = multer({storage});
campRoutes.route("/")
        .get(catchAsync(allCampgrounds))
        // .post(isLoggedIn,validateCampground,catchAsync(addCampground));
        .post(isLoggedIn, upload.array('image'),validateCampground,catchAsync(addCampground));

campRoutes.get("/new", isLoggedIn ,newCampground);
campRoutes.get("/:id/edit", isLoggedIn,isAuthor,catchAsync(renderEditCampgroundForm));

campRoutes.route("/:id")
        .get(catchAsync(showCampgroundAndReview))
        .put(isLoggedIn, isAuthor, upload.array('image'),validateCampground,catchAsync(updateCampgroun))
        .delete(isLoggedIn,isAuthor,catchAsync(deleteCampground));

export default campRoutes;
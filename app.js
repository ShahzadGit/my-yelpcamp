import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import methodOverride from "method-override";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import mongoSanitize from "express-mongo-sanitize"
import LocalStrategy from "passport-local";
import { AppError } from "./utils/AppError.js";
import campRoutes from "./routes/campRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import User from "./models/user.js";
import helmet from "helmet";
import MongoStore from "connect-mongo"; //For storing session data on MongoDB

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config();

const store = MongoStore.create({
  mongoUrl: process.env.MONGODB_URL,
  touchAfter: 24 * 60 * 60,
  crypto: {
      secret: 'thisshouldbeabettersecret!'
  }
});
store.on("error", function(e){
  console.log("Session Error: ",e);
})
const sessionConfig = {
  name: 'session',
  store,
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      // secure: true, //It should be set, for production i.e for https, but localhost is http
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig))
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(flash());
app.use(mongoSanitize());//It removes any prohibited character in req.query/req.params/req.body
//////////-----HELMET---////////////////////
app.use(helmet());
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dmk9sh1wn/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://res.cloudinary.com/douqbebwk/", // Colt's account
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
//////////-----HELMET---////////////////////

// Passport Authentication
app.use(passport.initialize());
app.use(passport.session()); //Should be below express-session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //Serialize user object into session
passport.deserializeUser(User.deserializeUser());

// This middleware should be set before routes, so that local variables are accessible to all templates/ejs files.
app.use((req, res, next)=>{
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use("/campgrounds", campRoutes);
// We need to set {mergeParams: true} where this route is defined. So that to grab the params in url, else it would return a null params
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.engine("ejs", ejsMate);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.get("/", (req, res) => {
  res.render("Home.ejs");
});

app.all("*", (req, res, next) => {
  next(new AppError("Page not found", 404));
});

app.use((err, req, res, next) => {
  // const { statusCode = 500, message = "Something went wrong" } = err;
  // res.status(statusCode).send(message);
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";

  res.status(statusCode).render("error.ejs", { err });
});

const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGODB_URL, {})
  .then(() => {
    app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));
  })
  .catch((err) => console.log(`${err} did not connect`));

import mongoose from "mongoose";
import { cities } from "./cities.js";
import { places, descriptors } from "./seedHelpers.js";
import Campground from "../models/campground.js";
import dotenv from "dotenv";
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, {})
  .then(() => {
    console.log("Database connected");
    
    // In order to delete all existing data use the commented Promise, 
// Campground.deleteMany({})
//   .then(function () {
//     // Success
//     console.log("Data deleted");
//   })
//   .catch(function (error) {
//     // Failure
//     console.log(error);
//   });

    for (let i = 0; i < 20; i++) {
      const random1000 = Math.floor(Math.random() * 1000);
      const price = Math.floor(Math.random() * 20) + 10;

      const camp = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
        price,
        geometry: {
          type: "Point",
          coordinates: [
            cities[random1000].longitude,
            cities[random1000].latitude,
          ],
        },
        images: [
                  {
                    url:
                      "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png",
                    filename: "YelpCamp/ahfnenvca4tha00h2ubt",
                  },
                  {
                    url:
                      "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png",
                    filename: "YelpCamp/ruyoaxgf72nzpi4y6cdi",
                  },
                ],
        reviews: [],
        author: '65e613c0a58b1906b61d5f95'
      });
      camp.save();
    }
    console.log("Data added");
  })
  .catch((err) => console.log(`${err} did not connect`));

const sample = (array) => array[Math.floor(Math.random() * array.length)];

// This will delete all documents in the collection:
// Campground.deleteMany({})
//   .then(function () {
//     // Success
//     console.log("Data deleted");
//   })
//   .catch(function (error) {
//     // Failure
//     console.log(error);
//   });

// const seedDB = async () => {
//   await Campground.deleteMany({});
//   for (let i = 0; i < 300; i++) {
//     const random1000 = Math.floor(Math.random() * 1000);
//     const price = Math.floor(Math.random() * 20) + 10;
//     const camp = new Campground({
//       //YOUR USER ID
//       author: "5f5c330c2cd79d538f2c66d9",
//       location: `${cities[random1000].city}, ${cities[random1000].state}`,
//       title: `${sample(descriptors)} ${sample(places)}`,
//       description:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
//       price,
//       geometry: {
//         type: "Point",
//         coordinates: [
//           cities[random1000].longitude,
//           cities[random1000].latitude,
//         ],
//       },
//       images: [
//         {
//           url:
//             "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png",
//           filename: "YelpCamp/ahfnenvca4tha00h2ubt",
//         },
//         {
//           url:
//             "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png",
//           filename: "YelpCamp/ruyoaxgf72nzpi4y6cdi",
//         },
//       ],
//     });
//     await camp.save();
//   }
// };

// seedDB().then(() => {
//   mongoose.connection.close();
// });

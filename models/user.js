import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// Passport will add username and password in schema behined the scenes
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('YelpUser', userSchema);
export default User;
import express from "express";
import { catchAsync } from "../utils/catchAsync.js";
import passport from "passport";
import { storeReturnTo } from "../utils/middleware.js";
import { login, logout, register } from "../controllers/users.js";
const userRoutes = express.Router();

userRoutes.route('/register')
    .get(async(req, res,)=>{res.render('user/user');})
    .post(catchAsync(register));

userRoutes.route('/login')
    .get((req, res)=>{res.render('user/login');})
    .post(storeReturnTo,passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),catchAsync(login));

userRoutes.get('/logout', logout);

export default userRoutes;

// app.get('/fakeuser', async(req, res)=>{
//     const user = new User({
//       email: 'abc@imcbsihala.edu.pk',
//       username: 'admin'
//     });
//     const newUser = await User.register(user, 'myPassword');
//     res.send(newUser);
//   })
  
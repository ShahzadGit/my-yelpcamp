import User from "../models/user.js";

const register = async(req,res,next)=>{
    try {
        const {username, email, password} = req.body;
        const user = new User({username,email});
        const newUser = await User.register(user, password);
        req.login(newUser, err=>{
            if(err) return next(err);
            req.flash("success", "Welcome to YelpCamp!!!");
            res.redirect('/campgrounds');        
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect('register');    
    }
    
}

const login = async(req, res)=>{
    req.flash('success', "You have successfully LogedIn");
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const logout = (req, res, next)=>{
    req.logOut(function(err){
        if(err){
            next(err)
        }
        req.flash('success', "Good Bye!!!");
        res.redirect('/campgrounds');
    })
}
export {register, login, logout};
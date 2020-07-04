const User = require('../models/user');
const fs = require('fs');
const path = require('path');


module.exports.profile = function (req, res) {

    User.findById(req.params.id, function (err, user) {
        //Err statement
        return res.render('user_profile', {
            title: 'Profile', profile_user: user
        });

    });
}

// to update the username and email of a signed in user
module.exports.update = async function (req, res) {

    // if (req.user.id == req.params.id) {
    //     User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
    //         return res.redirect('back');
    //     });
    // }

    

    if(req.user.id == req.params.id){
        try {
                    console.log(req.body);
                let user = await  User.findByIdAndUpdate(req.params.id);
                User.uploadedAvatar(req,res,function(err){
                    if(err){console.log('****Multer Error!', err);}
                    user.name = req.body.name;
                    user.email = req.body.email;

                    if(req.file){

                        if(user.avatar){
                            fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                        }// previous avatar is not deleting for me.. let me check

                        user.avatar = User.avatarPath + '/' + req.file.filename;
                    }
                    user.save();
                    req.flash('success', 'Updated!');

                    return res.redirect('back');

                });

                
                
        } catch (err) {
            console.log(err);
            return res.redirect('back');
        }
            
    } else {
        // http status code for unauthorized
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }

}

//Render the sign up page
module.exports.signUp = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', { title: 'Codeial | Sign Up' });
}

//Render the sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', { title: 'Codeial | Sign In' });
}


//Get the signup data
module.exports.create = function (req, res) {
    if (req.body.password != req.body.confirm_password) {
        return res.redirect('back');
    }

    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('Error in finding user in signing up'); return; }
        // console.log(req.body);
        // console.log(user);

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('Error in creating user in signing up'); return; }

                return res.redirect('/users/sign-in');
            });
        }
        else {
            return res.redirect('back');
        }

    });
}

//Sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success','Logged in Successfully');
    return res.redirect('/');
}

//To sign out 
module.exports.destroySession = function (req, res) {
    req.logout();//Created by passport

    req.flash('success','You have logged out!');

    return res.redirect('/');
}
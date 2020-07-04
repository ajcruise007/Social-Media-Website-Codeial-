const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');


// Tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID: '237050477784-reonbku5uh8j0iff7t0816ooctc5t3u1.apps.googleusercontent.com',
        clientSecret: '7-gv3xcPUiWHFLE750-Odp5u',
        callbackURL: 'http://localhost:8000/users/auth/google/callback'
        },
        function(accessToken, refreshToken, profile, done){
            // find a user
            User.findOne({email: profile.emails[0].value}).exec(function(err, user){
                if(err){console.log('Error in google strategy-passport', err); return;}

                console.log(profile);
                    // if found then set this user as req.user
                if(user){
                    return done(null, user);
                }
                else{
                    // if not found the create the user and set it as req.user
                    User.create({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        password: crypto.randomBytes(20).toString('hex')
                    
                    }, function(err, user){
                        if(err){console.log('Error in creating user in google strategy-passport', err); return;}

                        return done(null, user);
                            
                    });

                }

            });        
        }


));

module.exports = passport;
    



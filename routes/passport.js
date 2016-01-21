var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    User = require('../model/user');

passport.use(new LocalStrategy(function(username, password, done) {
    var email = username; //to mention that here email is expected in username
    User.findById(email, function(err, user) {
       if(!user)
          return done(null, false, {message: "The user doesn't exists"});
       else if(user.pwd !== password) {
          return done(null, false, {message: "wrong password"});
       } else {
          return done(null, user);
       }
    });
}));

passport.serializeUser(function(user, done) {
   done(null, user);
});

passport.deserializeUser(function(user, done) {
   User.findById(user.emailId, function(err, user) {
      done(null, user);
   });
});

module.exports = passport;

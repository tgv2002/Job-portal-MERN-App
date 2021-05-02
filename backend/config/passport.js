const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("User");
const key = require("./key");
var tok = {};
tok.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
tok.jSecret = key.jSecret;

module.exports = passport => {
  passport.use(
    new JwtStrategy(tok, function(payload, done){
      User.findById(payload.id)
        .then(user => {
          if (user) return done(null, user);
          else return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
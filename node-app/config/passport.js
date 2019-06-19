import { mongoConfig } from './index'
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('users')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = mongoConfig.secretOrKey
// opts.issuer = 'accounts.examplesoft.com'
// opts.audience = 'yoursite.net'

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    console.log(jwt_payload)
    User.findById(jwt_payload.id)
      .then(user => {
        if (user) {
          // 返回用户
          return done(null, user)
        }
        // return false
        return done(null, false)
      })
      .catch(err => console.log(err))
  }))
}
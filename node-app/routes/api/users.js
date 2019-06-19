import express from 'express'
import { mongoConfig } from '../../config'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const passport = require('passport')
import { User } from '../../models/Users'
const router = express.Router()

// $route GET api/users/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'login works'
  })
})

/**
 * @api {post} /api/users/register 用户注册
 * @apiName 用户注册
 * @apiGroup Users
 *
 * @apiParam (params) {String} email 用户邮箱
 *
 * @apiSuccess {Array} article 返回相应id的文章信息
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "_id": "5d099a7e165f5103bcd930bd",
 *    "name": "用户名",
 *    "email": "test@test.com\n",
 *    "password": "$2b$10$IHTM9B7P4AhRFV7swKxuDeTEH1L1fYuMeNXUTIL3Ojjn92U.cGOBi",
 *    "date": "2019-06-19T02:14:22.204Z",
 *    "__v": 0
 *  }
 * 
 * @apiError (Error 4xx) 404 注册错误
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 对应id的文章信息不存在
 *     {
 *       "error": err
 *     }
 */
router.post('/register', (req, res) => {

  console.log(req.body.email)
  const { email, name, password } = req.body

  // search email in database
  User.findOne({
    email
  }).then(user => {
    if (user) {
      return res.status(400).send({
        email: '邮箱已被注册'
      })
    } else {
      const avatar = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // avatar type
        d: 'mm' // 头像
      })
      const newUser = new User({
        name,
        email,
        avatar,
        password
      })
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

/**
 * @api {post} /api/users/login 用户登录
 * @apiName 用户登录
 * @apiGroup Users
 *
 * @apiParam (params) {String} email 用户邮箱
 *
 * @apiSuccess {string} token jwt password
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "_id": "5d099a7e165f5103bcd930bd",
 *    "name": "用户名",
 *    "email": "test@test.com\n",
 *    "password": "$2b$10$IHTM9B7P4AhRFV7swKxuDeTEH1L1fYuMeNXUTIL3Ojjn92U.cGOBi",
 *    "date": "2019-06-19T02:14:22.204Z",
 *    "__v": 0
 *  }
 * 
 * @apiError (Error 4xx) 404 登录错误
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 登录用户不存在
 *     {
 *       "error": err
 *     }
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body

  // search email in database
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return res.status(400).json({
        email: '用户不存在'
      })
    }
    // 密码匹配
    bcrypt.compare(password, user.password)
      .then(isMatch => {
        if (isMatch) {
          // 签名:规则，加密名字，过期时间，箭头函数
          const rule = {
            id: user.id,
            name: user.name
          }
          jwt.sign(
            rule,
            mongoConfig.secretOrKey,
            {
              expiresIn: 3600
            },
            (err, token) => {
              if (err) throw err
              res.json({
                success: true,
                token: 'Bearer ' + token
              })
            }
          )
          // res.json({
          //   msg: 'success'
          // })
        } else {
          return res.status(400).json({
            passwd: '密码错误'
          })
        }
      })
  })
})

/**
 * @api {get} /api/users/current 用户信息
 * @apiName 用户信息
 * @apiGroup Users
 *
 * @apiParam (params) {Array} 用户信息
 *
 * @apiSuccess {String} 用户信息
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "_id": "5d099a7e165f5103bcd930bd",
 *    "name": "用户名",
 *    "email": "test@test.com\n",
 *    "password": "$2b$10$IHTM9B7P4AhRFV7swKxuDeTEH1L1fYuMeNXUTIL3Ojjn92U.cGOBi",
 *    "date": "2019-06-19T02:14:22.204Z",
 *    "__v": 0
 *  }
 * 
 * @apiError (Error 4xx) 404 登录错误
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 登录用户不存在
 *     {
 *       "error": err
 *     }
 */
router.get(
  '/current',
  // 验证 token
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    })
})

module.exports = router

import express from 'express'
const bcrypt = require('bcrypt')

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
  const { email, name, avatar, password } = req.body

  // search email in database
  User.findOne({
    email
  }).then(user => {
    if (user) {
      return res.status(400).send({
        email: '邮箱已被注册'
      })
    } else {
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

module.exports = router

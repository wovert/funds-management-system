import express from 'express'
import { mongoConfig } from '../../config'
const passport = require('passport')
import { Profile } from '../../models/profile'
const router = express.Router()

// $route GET api/profiles/test
// @desc 返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({
    msg: 'profile works'
  })
})

/**
 * @api {post} /api/profiles/add 创建信息接口
 * @apiName 创建信息接口
 * @apiGroup profile
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
router.post(
  '/',
  // 验证 token
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const profileFields = {}
    if (req.body.type) profileFields.type = req.body.type
    if (req.body.describe) profileFields.describe = req.body.describe
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expend) profileFields.expend = req.body.expend
    if (req.body.cash) profileFields.cash = req.body.cash
    if (req.body.remark) profileFields.remark = req.body.remark
    new Profile(profileFields).save().then(profile => {
      res.json(profile)
    })
})

/**
 * @api {put} /api/profiles/:id 编辑信息接口
 * @apiName 编辑信息接口
 * @apiGroup profile
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
router.put(
  '/:id',
  // 验证 token
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    const profileFields = {}
    if (req.body.type) profileFields.type = req.body.type
    if (req.body.describe) profileFields.describe = req.body.describe
    if (req.body.income) profileFields.income = req.body.income
    if (req.body.expend) profileFields.expend = req.body.expend
    if (req.body.cash) profileFields.cash = req.body.cash
    if (req.body.remark) profileFields.remark = req.body.remark
    Profile.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: profileFields
      },
      {
        new: true
      }
    ).then(profile => res.json(profile))
  
})

/**
 * @api {delete} /api/profiles/:id 创建信息接口
 * @apiName 删除信息接口
 * @apiGroup profile
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
router.delete(
  '/:id',
  // 验证 token
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    Profile.findOneAndRemove(
      {
        _id: req.params.id
      }
    ).then(profile => {
      profile.save().then(profile => res.json(profile))
    })
    .catch(err => res.status(404).json('删除失败'))
  
})

/**
 * @api {post} /api/profiles
 * @apiName 获取所有信息
 * @apiGroup profile
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
router.get(
  '/',
  // 验证 token
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    Profile.find().then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容')
      }
      res.json(profile)
    }).catch(err => {
      res.status(404).json(err)
    })
  }
)

/**
 * @api {get} /api/profiles/:id 根据id返回信息
 * @apiName 根据id信息
 * @apiGroup profiles
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
  '/:id',
  // 验证 token
  passport.authenticate('jwt', {session: false}),
  (req, res) => {
    Profile.findOne({_id: req.params.id}).then(profile => {
      if (!profile) {
        return res.status(404).json('没有任何内容')
      }
      res.json(profile)
    }).catch(err => {
      res.status(404).json(err)
    })
  }
)

module.exports = router

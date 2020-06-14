const express = require('express')
const router = express.Router()
const { asyncHandler, csrfProtection } = require('./utils')
const db = require('../db/models')


router.get('/user', asyncHandler(async (req, res) => {
  const users = await db.User.findAll()
  res.render('users', { users })
}))

// - register page (GET - 'user/register')
router.get('/user/register', csrfProtection, asyncHandler(async (req, res) => {
  const user = db.User.build()
  res.render('user-register', { user, token: req.csrfToken() })
}))

// - register page (POST - 'user/register')

router.post('/user/register', csrfProtection, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, hashedPassword } = req.body
  await db.User.create({ firstName, lastName, email, hashedPassword })
  res.redirect('/user')
}))

module.exports = router

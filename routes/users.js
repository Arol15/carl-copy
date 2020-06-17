const express = require('express')
const router = express.Router()
const { Op } = require('sequelize')
const db = require('../db/models')
const { asyncHandler, csrfProtection } = require('./utils')
const { loginUser, logoutUser, requireAuth } = require('../auth')


router.get('/users', asyncHandler(async (req, res) => {
  const users = await db.User.findAll()
  res.render('users/users', { users })

}))


router.get('/users/register', csrfProtection, asyncHandler(async (req, res) => {
  const user = db.User.build()
  const teams = await db.Team.findAll()
  // res.render('users/user-register', { user, token: req.csrfToken() })
  res.render('users/user-register', { user, teams, token: req.csrfToken() })
}))


router.post('/users/register', csrfProtection, asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, teamId } = req.body
  const user = db.User.build({ firstName, lastName, email, hashedPassword: password, teamId })
  const teams = await db.Team.findAll()
  // TODO: add confirm password validation
  try {
    await user.save()
    loginUser(req, res, user)
    res.redirect(`/teams/${user.teamId}/projects`)
  } catch (err) {
    const errors = err.errors.map(error => error.message)
    res.render('users/user-register', {
      errors,
      user,
      teams,
      token: req.csrfToken()
    })
  }
}))


router.get('/users/login', csrfProtection, asyncHandler(async (req, res) => {
  res.render('users/user-login', { token: req.csrfToken() })
}))


router.post('/users/login', csrfProtection, asyncHandler(async (req, res) => {
  const { email, password } = req.body
  let errors = []

  try {
    const user = await db.User.findOne({ where: { email: { [Op.iLike]: email } }})
    if (user !== null) {
      const passwordMatch = await user.validatePassword(password)
      if (passwordMatch) {
        loginUser(req, res, user)
        return res.redirect('/users')
      }
    }

    errors.push('Login failed for the provided email address and password')
  } catch (err) {
    errors = err.errors.map(error => error.message)
  }

  res.render('users/user-login', {
    errors,
    email,
    token: req.csrfToken()
  })
}))


router.post('/users/logout', (req, res) => {
  logoutUser(req, res)
  res.redirect('/users/login')
})

router.get('/users/edit/:id(\\d+)', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10)
  const user = await db.User.findByPk(userId)
  res.render('users/user-edit', { user, token: req.csrfToken() })
}))


router.post('/users/edit/:id(\\d+)', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body
  const userId = parseInt(req.params.id, 10)
  const user = await db.User.findByPk(userId)
  user.firstName = firstName
  user.lastName = lastName
  user.email = email

  try {
    await user.save()
    res.redirect('/users')
  } catch (err) {
    const errors = err.errors.map(error => error.message)
    res.render('users/user-edit', {
        errors,
        user,
        token: req.csrfToken()
      })
  }
}))


// TODO: add user-delete.pug confirmation
// router.get('/users/delete/:id(\\d+)', csrfProtection, asyncHandler(async (req, res) => {
//     const userId = parseInt(req.params.id, 10)
//     const user = await db.User.findByPk(userId)
//     res.render('users/user-delete', {
//       user,
//       csrfToken: req.csrfToken(),
//     })
//   }))


router.post('/users/delete/:id(\\d+)', requireAuth, asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id, 10)
    const user = await db.User.findByPk(userId)
    if (req.session.auth.userId === userId) {
      logoutUser(req, res)
    }
    await user.destroy()
    res.redirect('/users')
  }))

module.exports = router

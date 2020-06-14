const express = require('express')
const router = express.Router()
const { asyncHandler } = require('./utils')
const db = require('../db/models')

router.get('/team', asyncHandler(async (req, res) => {
  const teams = await db.Team.findAll()
  res.render('teams', { teams })
}))

module.exports = router

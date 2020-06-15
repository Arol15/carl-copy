const express = require('express')
const router = express.Router()
const { asyncHandler } = require('./utils')
const db = require('../db/models')

router.get('/task', asyncHandler(async (req, res) => {
  const tasks = await db.Task.findAll()
  res.render('tasks', { tasks })
}))

module.exports = router

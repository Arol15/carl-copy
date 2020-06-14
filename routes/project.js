const express = require('express')
const router = express.Router()
const { asyncHandler } = require('./utils')
const db = require('../db/models')


router.get('/project', asyncHandler(async (req, res) => {
  const projects = await db.Project.findAll()
  res.render('projects', { projects })
}))

module.exports = router

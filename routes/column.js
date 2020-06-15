const express = require('express')
const router = express.Router()
const { asyncHandler } = require('./utils')
const db = require('../db/models')

router.get('/column', asyncHandler(async (req, res) => {
  const columns = await db.Column.findAll()
  res.render('columns', { columns })
}))

module.exports = router

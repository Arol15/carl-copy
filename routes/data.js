const express = require('express')
const router = express.Router()
const { asyncHandler } = require('./utils')
const { Task, Column, Project, Team, User } = require('../db/models')


router.get('/data', asyncHandler(async (req, res) => {
  const data = await Task.findAll({
    include: {
      model: Column,
      include: {
        model: Project,
        include: {
          model: Team,
  }}}})


  res.render('data', { data })
}))

module.exports = router

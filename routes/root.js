const express = require('express');
const router = express.Router();
const { Project, Team, Column, Task } = require('../db/models');

router.get('/', (req, res) => {
  const projects = Project.findAll();
  const teams = Team.findAll();
  const columns = Column.findAll();
  const tasks = Task.findAll();


  res.render('layout', { projects, teams, columns, tasks });
})

module.exports = router

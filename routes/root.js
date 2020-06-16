const express = require('express');
const router = express.Router();
const { Project, Team, Column, Task } = require('../db/models');

router.get('/', (req, res) => {
  res.render('home-page')
})

module.exports = router
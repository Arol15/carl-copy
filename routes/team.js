const express = require('express');
const csrf = require('csurf');

const { asyncHandler } = require('./utils');
const { Project, Team, Column, Task } = require('../db/models');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// teams overview
router.get('/teams', asyncHandler(async (req, res) => {
  const teams = await Team.findAll()
  res.render('teams/teams', { teams })
}))

// get team creation form
router.get('/teams/create', csrfProtection, asyncHandler(async (req, res) => {
  const team = await Team.build();

  res.render('teams/teams-create', { team, csrfToken: req.csrfToken() })
}));

// post new team
router.post('/teams/create', csrfProtection, asyncHandler(async (req, res, next) => {
  const { teamName } = req.body;

  const team = Team.build({ teamName });

  try {
    await team.save();
    res.redirect(`/teams`);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const error = err.errors.map(error => error.message);
      res.render('projects-create', {
        project,
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// edit team view
router.get('/teams/:teamId/edit', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);

  const team = await Team.findByPk(teamId);

  res.render('teams/teams-edit', { team, csrfToken: req.csrfToken() })
}));

// post edit
router.post('/teams/:teamId/edit', csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);

  const teamToUpdate = await Team.findByPk(teamId);

  const { teamName } = req.body;

  const team = { teamName }

  try {
    await teamToUpdate.update(team);
    res.redirect(`/teams`)
  } catch(err) {
    if (err.name === 'SequelizeValidationError') {
      const error = e.errors.map(error => error.message);
      res.render('projects/project-edit', {
        team: { ...team, id: teamId },
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// route to delete team view
router.get('/teams/:teamId/delete', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);

  const teamToDelete = await Team.findByPk(teamId)

  res.render('teams/teams-delete', { teamToDelete, csrfToken: req.csrfToken() })
}));

// delete team
router.post('/teams/:teamId/delete', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);

  const teamToDelete = await Team.findByPk(teamId)

  await teamToDelete.destroy();
  res.redirect(`/teams`);
}));


module.exports = router

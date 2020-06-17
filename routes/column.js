const express = require('express');
const csrf = require('csurf');

const { asyncHandler } = require('./utils');
const { Project, Team, Column, Task } = require('../db/models');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router.get('/teams/:teamId/projects/:projectId/columns', asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);

  const columns = await Column.findAll({
    where: { projectId },
    include: {
      model: Project,
      include: {
        model: Team
      }
    }
  });
  res.render('columns/columns', { columns, teamId, projectId });
}));

// get column creation form
router.get('/teams/:teamId/projects/:projectId/columns/create', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);

  const column = await Column.build();

  res.render('columns/columns-create', { column, teamId, projectId, csrfToken: req.csrfToken() })
}));

// post new column
router.post('/teams/:teamId/projects/:projectId/columns/create', csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);

  const { columnName } = req.body;

  const column = Column.build({ columnName, projectId });

  try {
    await column.save();
    res.redirect(`/teams/${teamId}/projects/${projectId}/columns`);
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

// edit column view
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/edit', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);

  const column = await Column.findByPk(columnId);

  res.render('columns/columns-edit', { column, teamId, projectId, columnId, csrfToken: req.csrfToken() })
}));

// post edit
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/edit', csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);

  const columnToUpdate = await Column.findByPk(columnId);

  const { columnName } = req.body;

  const column = { columnName, projectId }

  try {
    await columnToUpdate.update(column);
    res.redirect(`/teams/${teamId}/projects/${projectId}/columns`)
  } catch(err) {
    if (err.name === 'SequelizeValidationError') {
      const error = e.errors.map(error => error.message);
      res.render('projects/project-edit', {
        column: { ...column, id: columnId },
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// route to delete column view
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/delete', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);

  const columnToDelete = await Column.findByPk(columnId)

  res.render('columns/columns-delete', { columnToDelete, teamId, projectId, columnId, csrfToken: req.csrfToken() })
}));

// delete column
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/delete', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const columnToDelete = await Column.findByPk(columnId)

  await columnToDelete.destroy();
  res.redirect(`/teams/${teamId}/projects/${projectId}/columns`);
}));


module.exports = router

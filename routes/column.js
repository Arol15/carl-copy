const express = require('express');
const csrf = require('csurf');
const fetch = require('node-fetch')

const { asyncHandler } = require('./utils');
const { Project, Team, Column, Task } = require('../db/models');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

router.get('/teams/:teamId/projects/:projectId/columns', asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const projects = await Project.findAll({ 
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team }, 
    
  })
  const team = await Team.findOne({ where: teamId });
  const userId = req.session.auth.userId

  // TODO: Update the fetch URL for production to the heroku URL
  const response = await fetch(`http://localhost:8080/teams/${teamId}/projects/${projectId}/columns/board`)
  const state = await response.json()
  res.render('columns/columns', { state: JSON.stringify(state), projects, team, userId, teamId });
}));

// handles fetch request to get state for react component
router.get('/teams/:teamId/projects/:projectId/columns/board', asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);

  const columns = await Column.findAll({
    where: { projectId },
    attributes: ['id', 'columnName'],
  })

  const columnIds = columns.map(column => column.id)

  const tasks = await Task.findAll({
    where: {
      columnId: columnIds,
    },
    order: [['columnIndx', 'ASC']],
  })

  const taskState = {}
  const columnState = {}

  for (let task of tasks) {
    taskState[`task-${task.id}`] = { id: `task-${task.id}`, content: task.taskDescription }
  }

  let columnTasks;

  for (let column of columns) {
    columnState[`column-${column.id}`] = { id: `column-${column.id}`, title: column.columnName }
    columnTasks = tasks.filter(task => task.columnId === column.id)
    columnTasks.sort((first, second) => first.columnIndx - second.columnIndx)
    columnState[`column-${column.id}`].taskIds = columnTasks.map(task => `task-${task.id}`)
  }

  // TODO: Implement column ordering

  const state = {
    tasks: taskState,
    columns: columnState,
    columnOrder: Object.keys(columnState)
  }

  // console.log(taskState)
  // console.log(columnState)
  // console.log(state)
  res.json({ state })

}));

// get column creation form
router.get('/teams/:teamId/projects/:projectId/columns/create', csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const projects = await Project.findAll()
  const team = await Team.findOne({ where: teamId });
  const userId = req.session.auth.userId
  const column = await Column.build();

  //added projects, team, userId so we can pass them through rendering.

  res.render('columns/columns-create', { column, teamId, projectId, projects, team, userId, csrfToken: req.csrfToken() })
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
  } catch (err) {
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

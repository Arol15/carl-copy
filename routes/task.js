const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./utils');
const { requireAuth } = require('../auth')
const { Task, Project, Column, Team } = require('../db/models');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: true });

// get all tasks in a particular column
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/tasks', requireAuth, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);

  const tasks = await Task.findAll({
    where: {
      columnId
    },
    order: [['columnIndx', 'ASC']],
    include: {
      model: Column,
      include: {
        model: Project,
        include: Team
      }
    }
  });

  res.render('tasks/tasks', { tasks, teamId, projectId, columnId });
}));

// get task creation form
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/create', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const columnId = parseInt(req.params.columnId, 10);
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);

  const task = await Task.build();

  res.render('tasks/task-create', { task, columnId, teamId, projectId, csrfToken: req.csrfToken() });
}));

// post new task
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/create', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);

  const { taskDescription, dueDate, columnIndx } = req.body;

  const task = Task.build({ taskDescription, dueDate, columnIndx, columnId });

  try {
    await task.save();
    res.redirect(`/teams/${teamId}/projects/${projectId}/columns/${columnId}/tasks`)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const error = err.errors.map(error => error.message);
      res.render('tasks/task-create', {
        task,
        error,
        teamId,
        projectId,
        columnId,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// get edit task form
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/:taskId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);

  const task = await Task.findByPk(taskId, {
    include: {
      model: Column,
      include: {
        model: Project,
        include: Team
      }
    }
  });

  res.render('tasks/task-edit', { task, csrfToken: req.csrfToken() })
}));

// post edit
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/:taskId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const taskId = parseInt(req.params.taskId, 10);

  const taskToUpdate = await Task.findByPk(taskId, {
    include: {
      model: Column,
      include: {
        model: Project,
        include: Team
      }
    }
  });

  const { taskDescription, dueDate, columnIndx } = req.body;
  const task = { taskDescription, dueDate, columnIndx };

  try {
    await taskToUpdate.update(task);
    res.redirect(`/teams/${taskToUpdate.Column.Project.Team.id}/projects/${taskToUpdate.Column.Project.id}/columns/${taskToUpdate.Column.id}/tasks`);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const error = e.errors.map(error => error.message);
      res.render('projects/project-edit', {
        task: { ...task, id: taskId },
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// route to delete task view
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/:taskId/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const taskId = parseInt(req.params.taskId, 10);

  const taskToDelete = await Task.findByPk(taskId)

  res.render('tasks/task-delete', { taskToDelete, teamId, projectId, columnId, taskId, csrfToken: req.csrfToken() })
}));


// delete task
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/:taskId/delete', requireAuth, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const taskId = parseInt(req.params.taskId, 10);

  const taskToDelete = await Task.findByPk(taskId);

  await taskToDelete.destroy();
  res.redirect(`/teams/${teamId}/projects/${projectId}/columns`);
}));



module.exports = router

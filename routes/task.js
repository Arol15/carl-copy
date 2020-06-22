const express = require('express');
const router = express.Router();
const { asyncHandler } = require('./utils');
const { requireAuth } = require('../auth')
const { Task, Project, Column, Team, User } = require('../db/models');
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
  const userId = req.session.auth.userId
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })
  const team = await Team.findOne({ where: teamId });
  const user = await User.findOne({ where: userId });
  // created initials variable
  const initials = user.firstName[0] + user.lastName[0];
  const task = await Task.build();
  // res.render("projects/projects", { projects, user, userId, teammates, team, teamId, project, allTeams, initials, csrfToken: req.csrfToken() });
  res.render('tasks/task-create', { task, columnId, teamId, initials, userId, teammates, projectId, team, projects, csrfToken: req.csrfToken() });
}));

// post new task
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/create', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const userId = req.session.auth.userId
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })
  const { taskDescription, dueDate, columnIndx } = req.body;
  const team = await Team.findOne({ where: teamId });
  const user = await User.findOne({ where: userId });
  const initials = user.firstName[0] + user.lastName[0];

  const task = Task.build({ taskDescription, dueDate, columnIndx, columnId });

  try {
    await task.save();
    res.redirect(`/teams/${teamId}/projects/${projectId}/columns`)
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const error = err.errors.map(error => error.message);
      res.render('tasks/task-create', {
        columnId,
        teamId,
        initials,
        userId,
        teammates,
        projectId,
        team,
        projects,
        task,
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// get edit task form
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/:taskId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const taskId = parseInt(req.params.taskId, 10);
  const teamId = parseInt(req.params.teamId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const userId = req.session.auth.userId

  const task = await Task.findByPk(taskId, {
    include: {
      model: Column,
      include: {
        model: Project,
        include: Team
      }
    }
  });
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })
  const team = await Team.findOne({ where: teamId });
  const user = await User.findOne({ where: userId });
  // created initials variable
  const initials = user.firstName[0] + user.lastName[0];
  res.render('tasks/task-edit', { columnId, teamId, initials, userId, teammates, projectId, team, projects, task, csrfToken: req.csrfToken() })
}));

// post edit
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/tasks/:taskId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const taskId = parseInt(req.params.taskId, 10);
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const userId = req.session.auth.userId
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })
  const taskToUpdate = await Task.findByPk(taskId, {
    include: {
      model: Column,
      include: {
        model: Project,
        include: Team
      }
    }
  });
  const team = await Team.findOne({ where: teamId });
  const user = await User.findOne({ where: userId });
  const initials = user.firstName[0] + user.lastName[0];
  const { taskDescription, dueDate, columnIndx } = req.body;
  const task = { taskDescription, dueDate, columnIndx };

  try {
    await taskToUpdate.update(task);
    res.redirect(`/teams/${taskToUpdate.Column.Project.Team.id}/projects/${taskToUpdate.Column.Project.id}/columns`);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const error = e.errors.map(error => error.message);
      res.render('projects/project-edit', {
        columnId,
        teamId,
        initials,
        userId,
        teammates,
        projectId,
        team,
        projects,
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

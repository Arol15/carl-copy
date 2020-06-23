const express = require('express');
const csrf = require('csurf');
const fetch = require('node-fetch')
const { requireAuth } = require('../auth')
const { asyncHandler } = require('./utils');
const { Project, Team, Column, Task, User } = require('../db/models');

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

let url
if (process.env.NODE_ENV === 'production') {
  url = 'https://serene-journey-86279.herokuapp.com'
} else {
  url = 'http://localhost:8080'
}

router.get('/teams/:teamId/projects/:projectId/columns', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  // created initials variable
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const team = await Team.findOne({ where: teamId });
  const userId = req.session.auth.userId
  const user = await User.findOne({ where: userId });
  const initials = user.firstName[0] + user.lastName[0];
  const column = await Column.build();
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })

  // console.log(teamId, projects, teammates)
  // TODO: Update the fetch URL for production to the heroku URL
  const response = await fetch(`${url}/teams/${teamId}/projects/${projectId}/columns/board`)
  const state = await response.json()
  res.render('columns/columns', { state: JSON.stringify(state), projectId, teammates, column, projects, team, userId, teamId, initials, csrfToken: req.csrfToken() });
}));

// TODO: Persist new task/column layout to the database
router.post('/columns/update', requireAuth, asyncHandler(async (req, res) => {

  const { source, destination, draggableId, newColumnOrder } = req.body

  if (newColumnOrder) {
    const colIds = newColumnOrder.map(columnId => parseInt(columnId.match(/\d+/)[0], 10))

    const columns = await Column.findAll({
      where: { id: colIds },
      attributes: ['id', 'columnName', 'columnPos'],
    })

    for (let columnIndx in columns) {
      for (let index in colIds) {
        if (columns[columnIndx].id === colIds[index]) {
          columns[columnIndx].columnPos = index
          await columns[columnIndx].save()
        }
      }
    }

    res.end()
    return
  }
  const sourceColId = parseInt(source.droppableId.match(/\d+/)[0], 10)
  const sourceColIndx = source.index
  const destColId = parseInt(destination.droppableId.match(/\d+/)[0], 10)
  const destColIndx = destination.index
  const taskId = parseInt(draggableId.match(/\d+/)[0], 10)

  const task = await Task.findByPk(taskId)
  task.columnId = destColId
  task.columnIndx = destColIndx
  await task.save()


  const taskSave = await Task.findAll({
    where: { columnId: [sourceColId, destColId] },
    order: [['columnIndx', 'ASC']],
  })

  for (let task of taskSave) {
    if (task.columnId === sourceColId) {
      if (task.columnIndx > sourceColIndx) {
        task.columnIndx--
        await task.save()
      }
    } else if (task.columnId === destColId) {
      if (task.columnIndx >= destColIndx && task.id !== taskId) {
        task.columnIndx++
        await task.save()
      }
    }
  }
  res.end()
}))

// handles fetch request to get state for react component
router.get('/teams/:teamId/projects/:projectId/columns/board', asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);

  const columns = await Column.findAll({
    where: { projectId },
    attributes: ['id', 'columnName'],
    order: [['columnPos', 'ASC']]
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
router.get('/teams/:teamId/projects/:projectId/columns/create', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  // created initials variable
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const team = await Team.findOne({ where: teamId });
  let userId;
  if (req.session.auth) userId = req.session.auth.userId
  else userId = 5;
  const column = await Column.build();
  const user = await User.findOne({ where: userId });
  const initials = user.firstName[0] + user.lastName[0];
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })

  //added projects, team, userId so we can pass them through rendering.

  res.render('columns/columns-create', { column, teamId, initials, teammates, projectId, projects, team, userId, csrfToken: req.csrfToken() })
}));

// post new column
router.post('/teams/:teamId/projects/:projectId/columns/create', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const userId = req.session.auth.userId
  const user = await User.findOne({ where: userId });
  // created initials variable
  const initials = user.firstName[0] + user.lastName[0];
  // const project = Project.build({ projectName, teamId });
  const allTeams = await Team.findAll();
  const projects = await Project.findAll({
    where: {
      teamId: parseInt(req.params.teamId, 10),
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })
  const { columnName } = req.body;

  const columnPos = await Column.count({ where: { projectId } })
  const column = Column.build({ columnName, projectId, columnPos });

  try {
    await column.save();
    res.redirect(`/teams/${teamId}/projects/${projectId}/columns`);
  } catch (err) {
    if (err.name === 'SequelizeValidationError') {
      const error = err.errors.map(error => error.message);
      res.render('columns/columns', {
        teamId,
        projectId,
        column,
        userId,
        teammates,
        allTeams,
        initials,
        projects,
        // project,
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// edit column view
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  // created initials variable
  const projects = await Project.findAll({
    where: {
      teamId,
    },
    order: [["id", "ASC"]],
    include: { model: Team },
  });
  const team = await Team.findOne({ where: teamId });
  const userId = req.session.auth.userId
  const column = await Column.findByPk(columnId);
  const user = await User.findOne({ where: userId });
  const initials = user.firstName[0] + user.lastName[0];
  const teammates = await User.findAll({
    where: {
      teamId,
    },
  })

  res.render('columns/columns-edit', { column, team, initials, teammates, teamId, userId, projectId, projects, columnId, csrfToken: req.csrfToken() })
}));

// post edit
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/edit', requireAuth, csrfProtection, asyncHandler(async (req, res, next) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const team = await Team.findOne({ where: teamId });
  const userId = req.session.auth.userId
  const user = await User.findOne({ where: userId });
  // created initials variable
  const initials = user.firstName[0] + user.lastName[0];
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
        initials,
        team,
        teamId,
        userId,
        projectId,
        teammates,
        projects,
        error,
        csrfToken: req.csrfToken()
      })
    } else next(err);
  }
}));

// route to delete column view
router.get('/teams/:teamId/projects/:projectId/columns/:columnId/delete', requireAuth, csrfProtection, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const team = await Team.findOne({ where: teamId });
  // created initials variable
  const userId = req.session.auth.userId
  const user = await User.findOne({ where: userId });
  const initials = user.firstName[0] + user.lastName[0];
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
  // added extra keys to pass into delete view - Rocky
  const columnToDelete = await Column.findByPk(columnId)

  res.render('columns/columns-delete', { columnToDelete, initials, teammates, team, userId, projects, teamId, projectId, columnId, csrfToken: req.csrfToken() })
}));

// delete column
router.post('/teams/:teamId/projects/:projectId/columns/:columnId/delete', requireAuth, asyncHandler(async (req, res) => {
  const teamId = parseInt(req.params.teamId, 10);
  const projectId = parseInt(req.params.projectId, 10);
  const columnId = parseInt(req.params.columnId, 10);
  const columnToDelete = await Column.findByPk(columnId)

  await columnToDelete.destroy();
  res.redirect(`/teams/${teamId}/projects/${projectId}/columns`);
}));


module.exports = router

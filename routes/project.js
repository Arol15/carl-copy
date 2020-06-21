const express = require("express");
const csrf = require("csurf");
const { loginUser } = require('../auth')
const { asyncHandler } = require("./utils");
const { Project, Team, Column, Task, User } = require("../db/models");

// const reqSession = loginUser();
const router = express.Router();
const csrfProtection = csrf({ cookie: true });


// let getAllProjects = function(req, res, next) {

// }
// project overview
router.get(
  "/teams/:teamId/projects",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
    let userId;
    if (req.session.auth) userId = req.session.auth.userId
    else userId = 5;

    const projects = await Project.findAll({
      where: {
        teamId,
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });
    
    const user = await User.findOne({ where: userId });
    const project = await Project.build();
    const allTeams = await Team.findAll();
    const team = await Team.findOne({ where: teamId });
    console.log("==============", projects)


    res.render("projects/projects", { projects, user, userId, team, teamId, project, allTeams, csrfToken: req.csrfToken() });
    // next(projects)
  })
);

// get project creation form
// router.get(
//   "/teams/:teamId/projects-create",
//   csrfProtection,
//   asyncHandler(async (req, res) => {
//     const teamId = parseInt(req.params.teamId, 10);

//     const project = await Project.build();
//     const allTeams = await Team.findAll();

//     res.render("projects/projects-create", {
//       project,
//       teamId,
//       allTeams,
//       csrfToken: req.csrfToken(),
//     });
//   })
// );

// post new project
router.post(
  "/teams/:teamId/projects",
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const { projectName, teamId } = req.body;
    const userId = req.session.auth.userId
    const project = Project.build({ projectName, teamId });
    const allTeams = await Team.findAll();
    const projects = await Project.findAll({
      where: {
        teamId: parseInt(req.params.teamId, 10),
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });

    try {
      await project.save();
      res.redirect(`/teams/${teamId}/projects`);
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const error = err.errors.map((error) => error.message);
        res.render("projects/projects", {
          userId,
          allTeams,
          projects,
          teamId: parseInt(req.params.teamId, 10),
          project,
          error,
          csrfToken: req.csrfToken(),
        });
        // res.redirect(`/teams/${teamId}/projects`)
      } else next(err);
    }
  })
);

// view one specific project
router.get(
  "/teams/:teamId/projects/:projectId",
  asyncHandler(async (req, res) => {
    const projectId = parseInt(req.params.projectId, 10);
    const teamId = parseInt(req.params.teamId, 10);
    const team = await Team.findOne({ where: teamId });
    const userId = req.session.auth.userId
    const projects = await Project.findAll({
      where: {
        teamId,
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });
    const project = await Project.findByPk(projectId, {
      include: {
        model: Column,
        include: Task,
      },
    });

    res.render("projects/project-detail", { projects, project, teamId, userId, team });
  })
);

// edit project view
router.get(
  "/teams/:teamId/projects/:projectId/edit",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
    const projectId = parseInt(req.params.projectId, 10);
    const team = await Team.findOne({ where: teamId });
    const project = await Project.findByPk(projectId, {
      include: { model: Team },
    });
    const userId = req.session.auth.userId
    const projects = await Project.findAll({
      where: {
        teamId,
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });

    const allTeams = await Team.findAll();

    res.render("projects/project-edit", {
      userId,
      team,
      projects,
      project,
      allTeams,
      teamId,
      csrfToken: req.csrfToken(),
    });
  })
);

// post edit
router.post(
  "/teams/:teamId/projects/:projectId/edit",
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const projectId = parseInt(req.params.projectId, 10);
    const projectToUpdate = await Project.findByPk(projectId);
    const { projectName, teamId } = req.body;
    const team = await Team.findOne({ where: { id: parseInt(req.params.teamId) } });
    const project = { projectName, teamId };
    const allTeams = await Team.findAll();
    const userId = req.session.auth.userId
    const projects = await Project.findAll({
      where: {
        teamId,
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });

    try {
      await projectToUpdate.update(project);
      res.redirect(`/teams/${teamId}/projects`);
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const error = err.errors.map((error) => error.message);
        res.render("projects/project-edit", {
          userId,
          team,
          allTeams,
          teamId: parseInt(req.params.teamId),
          projects,
          project: { ...project, id: projectId },
          error,
          csrfToken: req.csrfToken(),
        });
      } else next(err);
    }
  })
);

// route to delete project view
router.get(
  "/teams/:teamId/projects/:projectId/delete",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId
    const teamId = parseInt(req.params.teamId, 10);
    const projectId = parseInt(req.params.projectId, 10);
    const projectToDelete = await Project.findByPk(projectId);
    const team = await Team.findOne({ where: teamId });
    const projects = await Project.findAll({
      where: {
        teamId,
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });

    res.render("projects/project-delete", {
      userId,
      team,
      projects,
      projectToDelete,
      teamId,
      csrfToken: req.csrfToken(),
    });
  })
);

// delete project
router.post(
  "/teams/:teamId/projects/:projectId/delete",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const userId = req.session.auth.userId
    const teamId = parseInt(req.params.teamId, 10);
    const projectId = parseInt(req.params.projectId, 10);
    const projectToDelete = await Project.findByPk(projectId);
    await projectToDelete.destroy();
    res.redirect(`/teams/${teamId}/projects`);
  })
);

module.exports = router;

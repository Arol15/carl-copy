const express = require("express");
const csrf = require("csurf");

const { asyncHandler } = require("./utils");
const { Project, Team, Column, Task } = require("../db/models");

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

    const projects = await Project.findAll({
      where: {
        teamId,
      },
      order: [["id", "ASC"]],
      include: { model: Team },
    });

    const project = await Project.build();
    const allTeams = await Team.findAll();
    const team = await Team.findOne({ where: teamId });
    // console.log(allTeams)

    res.render("projects/projects", { projects, team, teamId, project, allTeams, csrfToken: req.csrfToken() });
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

    const project = await Project.findByPk(projectId, {
      include: {
        model: Column,
        include: Task,
      },
    });

    res.render("projects/project-detail", { project });
  })
);

// edit project view
router.get(
  "/teams/:teamId/projects/:projectId/edit",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const teamId = parseInt(req.params.teamId, 10);
    const projectId = parseInt(req.params.projectId, 10);

    const project = await Project.findByPk(projectId, {
      include: { model: Team },
    });

    const allTeams = await Team.findAll();

    res.render("projects/project-edit", {
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

    const project = { projectName, teamId };

    try {
      await projectToUpdate.update(project);
      res.redirect(`/teams/${teamId}/projects`);
    } catch (err) {
      if (err.name === "SequelizeValidationError") {
        const error = e.errors.map((error) => error.message);
        res.render("projects/project-edit", {
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
    const teamId = parseInt(req.params.teamId, 10);
    const projectId = parseInt(req.params.projectId, 10);
    const projectToDelete = await Project.findByPk(projectId);

    res.render("projects/project-delete", {
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
    const teamId = parseInt(req.params.teamId, 10);
    const projectId = parseInt(req.params.projectId, 10);
    const projectToDelete = await Project.findByPk(projectId);

    await projectToDelete.destroy();
    res.redirect(`/teams/${teamId}/projects`);
  })
);

module.exports = router;

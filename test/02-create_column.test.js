const app = require("../app");
const request = require("supertest");
const expect = require("chai").expect;
var cheerio = require("cheerio");
const { pause, loadModel, migrationsConfig, seedsConfig, moduleInitializationErrorMessage } = require('./test-utils');
const Runner = require('umzug');

describe("columns display page?", () => {
  let res, $;
  let errorMessage;

  before(async () => {
    if (migrationsConfig && seedsConfig) {
      const migrator = new Runner(migrationsConfig);
      const seeder = new Runner(seedsConfig);
      try {
        await seeder.down({ to: 0 });
        await pause(0.25);
        await migrator.down({ to: 0 });
        await pause(0.25);
        await migrator.up();
        // await pause(0.25);
        // await seeder.up();
        // await pause(0.25);
      } catch (e) {
        console.error(e);
        errorMessage = `Error running migrations or seeds in before hook. See stack trace above for more details. Error message: ${e.message}`;
      }
    } else {
      errorMessage = moduleInitializationErrorMessage;
    }

    res = await request(app)
      .get("/teams/1/projects/1/columns")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
  });

  after(async () => {
    if (migrationsConfig && seedsConfig) {
      const migrator = new Runner(migrationsConfig);
      const seeder = new Runner(seedsConfig);
      try {
        await seeder.down({ to: 0 });
        await pause(0.25);
        await migrator.down({ to: 0 });
        await pause(0.25);
        await migrator.up();
      } catch (e) {
        console.error(e);
        errorMessage = `Error running migrations or seeds in after hook. See stack trace above for more details. Error message: ${e.message}`;
      }
    } else {
      errorMessage = moduleInitializationErrorMessage;
    }
  });

  // TODO: rewrite commented out tests once page layouts have been finalized

  // it("renders a navigation link to navigate to edit page", () => {
  //   const firstNav = $("a")[0];
  //   expect($(firstNav).attr("href")).to.equal("/teams/1/projects/1/columns/1/edit");
  // });

  // it("renders a navigation link to navigate to '/teams/:teamId/projects/:projectId/columns/create'", () => {
  //   const firstNav = $("a")[1];
  //   expect($(firstNav).attr("href")).to.equal("/create");
  // });

  // it("renders a navigation link to navigate to create columns", () => {
  //   const seventhNav = $("a")[7];
  //   expect($(seventhNav).attr("href")).to.equal("/create-interesting");
  // });

});

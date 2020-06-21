const app = require("../app");
const request = require("supertest");
const expect = require("chai").expect;
var cheerio = require("cheerio");
const { pause, loadModel, migrationsConfig, seedsConfig, moduleInitializationErrorMessage } = require('./test-utils');
const Runner = require('umzug');

describe("columns display page?", () => {
  let res, $;

  before(async () => {
    res = await request(app)
      .get("/teams/1/projects/1/columns")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
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

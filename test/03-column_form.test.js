const app = require("../app");
const request = require("supertest");
const expect = require("chai").expect;
var cheerio = require("cheerio");
const { pause, loadModel, migrationsConfig, seedsConfig, moduleInitializationErrorMessage } = require('./test-utils');
const Runner = require('umzug');

describe("columns-create form", () => {
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
      .get("/teams/1/projects/1/columns/create")
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

  it("renders a form that posts to create columns", () => {
    const form = $("form");
    expect(form.length).to.equal(1);
    expect(form.attr("action")).to.equal("/teams/1/projects/1/columns/create");
    expect(form.attr("method")).to.equal("post");
  });

  it("renders a name input field", () => {
    expect($("input[type='text'][name='columnName']").length).to.equal(1);
  });

  it("renders a submit button", () => {
    expect($("button[type='submit']").text()).to.equal("Create");
  });

  it("renders a hidden input for the csrfToken", () => {
    expect($("input[type='hidden']").attr("name")).to.equal("_csrf");
  });
});
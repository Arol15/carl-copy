const app = require("../app");
const request = require("supertest");
const expect = require("chai").expect;
var cheerio = require("cheerio");
const { pause, loadModel, migrationsConfig, seedsConfig, moduleInitializationErrorMessage } = require('./test-utils');
const Runner = require('umzug');

describe("Columns create form", () => {
  let res, $;

  before(async () => {
    res = await request(app)
      .get("/teams/1/projects/1/columns/create")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
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

describe("Projects create form", () => {
  let res, $;

  before(async () => {
    res = await request(app)
      .get("/teams/1/projects")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
  });

  it("renders a form that posts to create projects", () => {
    const form = $("form");
    expect(form.length).to.equal(1);
    expect(form.attr("action")).to.equal("/teams/1/projects");
    expect(form.attr("method")).to.equal("post");
  });

  it("renders a Project Name input field", () => {
    expect($("input[type='text'][name='projectName']").length).to.equal(1);
  });

  it("renders a Choose Team drop down menu", () => {
    expect($("select[name='teamId']").length).to.equal(1);
  });

  it("renders a submit button", () => {
    expect($("button[type='submit']").text()).to.equal("Create Project");
  });

  it("renders a hidden input for the csrfToken", () => {
    expect($("input[type='hidden']").attr("name")).to.equal("_csrf");
  });
});

describe("Tasks create form", () => {
  let res, $;

  before(async () => {
    res = await request(app)
      .get("/teams/1/projects/1/columns/1/tasks/create")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
  });


  it("renders a form that posts to create tasks", () => {
    const form = $("form");
    expect(form.length).to.equal(1);
    expect(form.attr("action")).to.equal("/teams/1/projects/1/columns/1/tasks/create");
    expect(form.attr("method")).to.equal("post");
  });

  it("renders a Description textarea field", () => {
    expect($("textarea[name='taskDescription']").length).to.equal(1);
  });

  it("renders a Due Date input field", () => {
    expect($("input[type='date'][name='dueDate']").length).to.equal(1);
  });

  it("renders a submit button", () => {
    expect($("button[type='submit']").text()).to.equal("Create");
  });

  it("renders a hidden input for the csrfToken", () => {
    expect($("input[type='hidden']").attr("name")).to.equal("_csrf");
  });
});

describe("Teams create form", () => {
  let res, $;

  before(async () => {
    res = await request(app)
      .get("/teams/create")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
  });

  it("renders a form that posts to create teams", () => {
    const form = $("form");
    expect(form.length).to.equal(1);
    expect(form.attr("action")).to.equal("/teams/create");
    expect(form.attr("method")).to.equal("post");
  });

  it("renders a Team Name input field", () => {
    expect($("input[type='text'][name='teamName']").length).to.equal(1);
  });

  it("renders a submit button", () => {
    expect($("button[type='submit']").text()).to.equal("Create");
  });

  it("renders a hidden input for the csrfToken", () => {
    expect($("input[type='hidden']").attr("name")).to.equal("_csrf");
  });
});

describe("User Registration form", () => {
  let res, $;

  before(async () => {
    res = await request(app)
      .get("/users/register")
      .expect("Content-type", /html/)
      .expect(200);
    $ = cheerio.load(res.text);
  });

  it("renders a form that posts to create new user", () => {
    const form = $("form");
    expect(form.length).to.equal(2);
    expect(form.attr("action")).to.equal("/users/register");
    expect(form.attr("method")).to.equal("post");
  });

  it("renders a First Name input field", () => {
    expect($("input[type='text'][name='firstName']").length).to.equal(1);
  });

  it("renders a Last Name input field", () => {
    expect($("input[type='text'][name='lastName']").length).to.equal(1);
  });

  it("renders a Email input field", () => {
    expect($("input[type='email'][name='email']").length).to.equal(1);
  });

  it("renders a Password input field", () => {
    expect($("input[type='password'][name='password']").length).to.equal(1);
  });

  it("renders a Confirm Password input field", () => {
    expect($("input[type='password'][name='confirmPassword']").length).to.equal(1);
  });

  it("renders a Team select field", () => {
    expect($("select[name='teamId']").length).to.equal(1);
  });

  it("renders a submit button", () => {
    expect($("button[type='submit']").text().substring(0, 8)).to.equal("Register");
  });

  it("renders a hidden input for the csrfToken", () => {
    expect($("input[type='hidden']").attr("name")).to.equal("_csrf");
  });
});

const { describe, it, before } = require('mocha');
const { expect } = require('chai');
const request = require('supertest');
const cheerio = require('cheerio');

const {
  addTestDatabaseConfigIfConfigDatabaseModuleExists,
  loadModule,
  suppressRequestLogging,
} = require('./utils');
const {
  checkHeading,
  setDomElements,
} = require('./utils/form');

const runSpecs = () => {
  let bail = false;
  let app = null;

  addTestDatabaseConfigIfConfigDatabaseModuleExists();

  // Test that the `app` module exists.

  describe('`app` module exists', () => {
    app = loadModule('../app');

    if (app === null) {
      bail = true;
      return;
    }

    suppressRequestLogging(app);
  });

  if (bail) return;

  // Test that the `routes` module exists.

  describe('for `apps` module', () => {
    const routes = loadModule('../app');

    if (routes === null) {
      bail = true;
      return;
    }

    // Test that requesting an unknown path
    // results in the "Page Not Found" page.

    describe('test `/asdf` (unknown) route', () => {
      let $ = null;
      before(async () => {
        const res = await request(app)
          .get('/asdf')
          .expect('Content-type', /html/)
          .expect(404);

        $ = setDomElements(res);
      });

      checkHeading('Page Not Found');
    });
  });
};

runSpecs();

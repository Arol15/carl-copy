var superagent = require('superagent');
var agent = superagent.agent();
var theAccount = {
  "email": "test@test.com",
  "password": "1Az@"
};

exports.login = function (request, done) {
  request
    .post('/login')
    .send(theAccount)
    .end(function (err, res) {
      if (err) {
        throw err;
      }
      console.log("+++++++++++++", agent)
      agent.saveCookies(res);
      done(agent);
    });
};
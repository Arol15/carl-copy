# Introduction
CARL is a work-flow application to help users organize their tasks.  
Tasks can be assigned to specific projects where they can be organized into categories.

- User **must** belong to a Team in order to be able to create projects and assign tasks

# Live Link

[C.A.R.L Work-flow Manager](https://still-reef-05529.herokuapp.com/)

# Technologies

- Database management
	- Sequelize ORM
	- Postgres
- Front-end development
	- React
	- AJAX
	- DOM manipulation
	- CSS
	- Bootstrap
- Back-end development
	- Express.js
	- Express-session
	- Connect PG Simple
	- Csurf
	- Dotenv
	- Sequelize
	- Bcrypt
	- Unit tests to test:
		- Mocha
		- Chai
		- Cheerio
		- Moment
		- Sqlite3
		- Supertest
		- Umzug

# Features

- Professional landing page
![home-page]()

- Drag-n-drop using React
```javascript
code snippet using react
and maybe gif
```

- Create and manage projects
![proj-CRUD-gif]()

- Create and manage tasks
![tasks-CRUD-gif]()
![columns-CRUD-gif]()

- Unit tests
	- Models exists and creates good instances
	- Cannot create instance with null values
	- Able to query the data using sequelize
	- Can successfully eager load data from associated table
	- Correctly set:
		- environment variables
		- sequelizerc configs
	-  Correctly renders:
		- homepage
		- form elements with correct fields

![unit-tests](public/images/test-screenshot-1)
![unit-tests](public/images/test-screenshot-2)
![unit-tests](public/images/test-screenshot-3)
![unit-tests](public/images/test-screenshot-4)

# Technical Challenges

### Front-end
- front end challenges
### Back-end
- Unit Tests
	- decided to use customized functions to create model instances instead of using separate seed file for test environment
```javascript
async  function  testCreate(callback)  {
	let succeeded =  true;
	try  {
		await  callback();
	}  catch (e) {
		succeeded =  false;
	}
	return succeeded;
}

async  function  createModel(Model,  object)  {
	let instance =  null;
	await  testCreate(async  ()  =>  {
		instance =  await Model.create(object);
	});
	return instance;
}

const  passwordSample  =  'Abc1!'
function  userValues(o)  {
	return  {
		firstName:  str(20),
		lastName:  str(20),
		hashedPassword: passwordSample,
		email:  email(200),
		teamId:  Math.floor(Math.random() *  2),
		...o
	};
}
```
```javascript
it('exists and creates a good instance',  async  ()  =>  {
	const  {  models,  error  }  =  loadModel('User');
	if (stopTest(errorMessage || userError || error)) return;	
	const  {  User  }  = models;
	const  values  =  userValues({ teamId });
	succeeded =  await  createModel(User, values);
	if (!succeeded) return expect.fail(`Could not create an User with ${j(values)}`);
});
```


# Future Implementation

- Delete user
- Allow users to have many teams
- Allow a user to remove team members
- Indicate completed tasks and projects
- Invite user button

# Asana-Clone
a/A Week 12 Full Stack Project - Asana Clone

## Starting up the application
- Development: npm run start:development
- Production: npm start

## Github Workflow

### Pull to update local branch to include master
- git checkout master
- git pull
- git checkout 'local branch'
- git merge master
- handle merge conflicts to finish merge

### Pushing local changes
- git add 'files to add'
- git commit -m 'message'
- git push
- select on compare changes menu (base: master  compare: 'local branch name')
- create pull request on github and leave comments
- wait for 1 team member to approve
- merge changes
- delete local branch

## Heroku Workflow
- git push heroku master

### Provision a database for Heroku
- heroku addons:create heroku-postgresql:hobby-dev

### Optional: Deploy local branch to Heroku
- git push heroku branchname:master


### For Changes to DB:
- heroku run npx sequelize-cli db:seed:undo:all
- heroku run npx sequelize-cli db:migrate:undo:all
- heroku run npx sequelize-cli db:migrate
- heroku run npx sequelize-cli db:seed:all

### Monitor Logs on Heroku
- heroku logs --tail

### Access Heroku psql instance
- heroku pg:psql

### Setup autocomplete for Heroku
- heroku autocomplete


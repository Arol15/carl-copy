# Introduction
CARL is a work-flow application to help users organize their tasks.  
Tasks can be assigned to specific projects where they can be organized into categories.

- User **must** belong to a Team in order to be able to create projects and assign tasks

# Live Link

[C.A.R.L Work-flow Manager](https://hidden-fortress-08833.herokuapp.com/)

# Technologies

- Database management
	- Sequelize ORM
	- PostgreSQL
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
	- Unit tests written using:
		- Mocha
		- Chai
		- Cheerio
		- Moment
		- Sqlite3
		- Supertest
		- Umzug

# Features

- Professional landing page
![home-page](public/images/home-page.png)

- Drag-n-drop using React


- Create and manage projects
![proj-CRUD-gif](public/images/drag-n-drop.gif)

- Create and manage tasks
![tasks-CRUD-gif](public/images/create-new-task.gif)
![columns-CRUD-gif](public/images/create-new-column.gif)

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

![unit-tests](public/images/test-screenshot-1.png)
![unit-tests](public/images/test-screenshot-2.png)
![unit-tests](public/images/test-screenshot-3.png)
![unit-tests](public/images/test-screenshot-4.png)

# Technical Challenges

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
- Update unit tests so that it can log in to pass the test statements

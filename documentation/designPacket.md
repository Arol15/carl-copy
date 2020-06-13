# Design Packet

## Feature Scope
1. Home page
2. User Registration / Login
3. CRUD for Projects / Tasks / Teams / Users
4. README
5. WIKI
6. Drag n Drop
7. TDD
8. TDD


## Endpoints

### Homepage
- home page (GET - '/')

### Registration CRUD
- register page (GET - 'users/register')
- register page (POST - 'users/create')
  - after registration, redirect to 'teams/:teamId/projects'

### Login
- login page (GET - 'users/log-in')
- login page (POST - 'users/log-in' && 'users/token')
  - after logging in, redirect to 'teams/:teamId/projects'

### Project CRUD
- project overview (GET - 'teams/:teamId/projects')
- project creation (GET - 'teams/:teamId/projects/create')
- project creation (POST - 'teams/:teamId/projects/create')

- project workspace (GET - 'teams/:teamId/projects/:projectId')
  - lists out the tasks and columns for this project

- delete project (DELETE - 'teams/:teamId/projects/:projectId')

### Team CRUD
- team creation (GET/POST - 'teams/create')

### Column CRUD
- column create (POST - 'teams/:teamId/projects/:projectId/create-column')
- column edit (PUT - 'teams/:teamId/projects/:projectId/:columnId')
- column delete (DELETE - 'teams/:teamId/projects/:projectId/:columnId')

### Task CRUD
- edit task (GET/PUT - 'teams/:teamId/projects/:projectId/:columnId/:taskId')
- delete task (DELETE - 'teams/:teamId/projects/:projectId/:columnId/:taskId')
- task create (POST - 'teams/:teamId/projects/:projectId/:columnId/create-task')
  - form for describing what the task is
  - once you submit
  - redirect to 'teams/:teamId/projects/:projectId'



## Pug templates
1. home page
2. log in - form
3. register - form
4. create project - form
    - fields
      - project name
    - edit project: form with delete/save/cancel button
5. project workspace
    - list of projects
6. project overview
    - list of columns and tasks inside columns
7. create task - form
    - edit/delete task - form with delete/save/cancel button
8. create team
    - form with drop down menu listing all users
    - edit/delete team - form with delete/save/cancel button

## Models
- Users
  - firstName
  - lastName
  - email
  - password
  - teamId FK (one User to many Team relationship)

- Tasks
  - taskName
  - description
  - dueDate
  - columnId FK (many Task to one Columns relationship)

- Teams
  - teamName
  - userId FK (many Team to one User relationship)

- Projects
  - projectName (many Project to one Team relationship)
  - teamId (one Team to many Project relationship)

- Columns (join table)
  - projectId FK (one Project to many Task relationship)
  - columnName FK (many Column to one Project relationship)



## Future Implementation
- delete user
- delete team members
- indicate completed task & project



### Feature List
- TDD
- Drag n Drop
- Register/Log-in
- Projects/Tasks/Teams/Users Tables
- Homepage
- README & WIKI

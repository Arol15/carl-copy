'use strict';

const faker = require('faker')
const bcrypt = require('bcryptjs')

module.exports = {
  up: async (queryInterface, Sequelize) => {

    const teams = await queryInterface.bulkInsert('Teams', [
      {
        teamName: faker.commerce.department(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        teamName: faker.commerce.department(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],{ returning: true })

    const users = await queryInterface.bulkInsert('Users', [
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password()),
        email: faker.internet.email(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password()),
        email: faker.internet.email(),
        teamId: teams[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password()),
        email: faker.internet.email(),
        teamId: teams[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        hashedPassword: bcrypt.hashSync(faker.internet.password()),
        email: faker.internet.email(),
        teamId: teams[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],{ returning: true })

    const projects = await queryInterface.bulkInsert('Projects', [
      {
        projectName: faker.commerce.productName(),
        teamId: teams[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectName: faker.commerce.productName(),
        teamId: teams[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectName: faker.commerce.productName(),
        teamId: teams[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],{ returning: true })

    const columns = await queryInterface.bulkInsert('Columns', [
      {
        projectId: projects[0].id,
        columnName: faker.hacker.ingverb(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projects[0].id,
        columnName: faker.hacker.ingverb(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projects[0].id,
        columnName: faker.hacker.ingverb(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projects[1].id,
        columnName: faker.hacker.ingverb(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projects[2].id,
        columnName: faker.hacker.ingverb(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        projectId: projects[2].id,
        columnName: faker.hacker.ingverb(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],{ returning: true })

    return queryInterface.bulkInsert('Tasks', [
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[0].id,
        columnIndx: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[0].id,
        columnIndx: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[0].id,
        columnIndx: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[1].id,
        columnIndx: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[1].id,
        columnIndx: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[2].id,
        columnIndx: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[3].id,
        columnIndx: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[3].id,
        columnIndx: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[4].id,
        columnIndx: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[5].id,
        columnIndx: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[5].id,
        columnIndx: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        taskDescription: faker.company.catchPhrase(),
        dueDate: faker.date.future(),
        columnId: columns[5].id,
        columnIndx: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Tasks", null, {});
    await queryInterface.bulkDelete("Columns", null, {});
    await queryInterface.bulkDelete("Projects", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    return queryInterface.bulkDelete("Teams", null, {});
  }
};

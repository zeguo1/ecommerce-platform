'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);
    
    await queryInterface.bulkInsert('Users', [{
      username: 'user1',
      email: 'user1@example.com',
      password: hashedPassword,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};

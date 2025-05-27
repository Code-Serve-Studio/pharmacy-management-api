'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert into roles
    await queryInterface.bulkInsert('roles', [
      {
        role_name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    // Insert into permissions
    const modules = [
      'dashboard', 'products', 'transactions', 'purchase',
      'link_cashier', 'retail_cashier', 'paramedic_cashier', 'branch_cashier',
      'users', 'roles', 'group', 'category'
    ];

    const permissions = modules.map((module, index) => ({
      role_id: 1,
      module,
      can_create: 1,
      can_read: 1,
      can_update: 1,
      can_delete: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await queryInterface.bulkInsert('permissions', permissions, {});

    // Hash password (gunakan bcryptjs di seeder real)
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('12341234', 10);

    // Insert into users
    await queryInterface.bulkInsert('users', [
      {
        photo_profile: null,
        username: 'admin',
        password: hashedPassword,
        role_id: 1,
        full_name: 'admin',
        email: 'admin@mail.com',
        status: 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', { username: 'admin' }, {});
    await queryInterface.bulkDelete('permissions', { role_id: 1 }, {});
    await queryInterface.bulkDelete('roles', { role_name: 'Admin' }, {});
  }
};

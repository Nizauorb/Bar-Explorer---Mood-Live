import { QueryInterface, DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';

export default {
  up: async (queryInterface: QueryInterface) => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('users', [
      {
        email: 'demo@barexplorer.com',
        username: 'DemoUser',
        password: hashedPassword,
        avatar_url: 'https://picsum.photos/seed/demo/200/200.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'lucas@barexplorer.com',
        username: 'Lucas22',
        password: hashedPassword,
        avatar_url: 'https://picsum.photos/seed/lucas/200/200.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        email: 'anna@barexplorer.com',
        username: 'Anna28',
        password: hashedPassword,
        avatar_url: 'https://picsum.photos/seed/anna/200/200.jpg',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('users', {
      email: ['demo@barexplorer.com', 'lucas@barexplorer.com', 'anna@barexplorer.com'],
    });
  },
};

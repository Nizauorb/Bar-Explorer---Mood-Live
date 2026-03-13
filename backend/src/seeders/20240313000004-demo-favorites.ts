import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    const favorites = [
      // Favoris de l'utilisateur 1 (demo@barexplorer.com)
      {
        user_id: 1,
        bar_id: 1, // Le Comptoir Général
        created_at: new Date(),
      },
      {
        user_id: 1,
        bar_id: 2, // La Cave à Bulles
        created_at: new Date(),
      },
      
      // Favoris de l'utilisateur 2 (lucas@barexplorer.com)
      {
        user_id: 2,
        bar_id: 3, // Le Fougères
        created_at: new Date(),
      },
      {
        user_id: 2,
        bar_id: 1, // Le Comptoir Général
        created_at: new Date(),
      },
      
      // Favoris de l'utilisateur 3 (anna@barexplorer.com)
      {
        user_id: 3,
        bar_id: 2, // La Cave à Bulles
        created_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('favorites', favorites);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('favorites', {}, {});
  },
};

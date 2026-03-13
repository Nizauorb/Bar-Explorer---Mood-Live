import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    // Créer des votes avec des IDs fixes pour éviter les erreurs de requête
    const votes = [
      // Votes pour Le Comptoir Général (id: 1)
      {
        user_id: 1, // demo@barexplorer.com
        bar_id: 1,   // Le Comptoir Général
        ambiance_score: 4,
        affluence_level: 'moyenne',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
      },
      {
        user_id: 2, // lucas@barexplorer.com
        bar_id: 1,   // Le Comptoir Général
        ambiance_score: 5,
        affluence_level: 'pleine',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1h ago
      },
      
      // Votes pour La Cave à Bulles (id: 2)
      {
        user_id: 1, // demo@barexplorer.com
        bar_id: 2,   // La Cave à Bulles
        ambiance_score: 3,
        affluence_level: 'faible',
        created_at: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3h ago
      },
      {
        user_id: 3, // anna@barexplorer.com
        bar_id: 2,   // La Cave à Bulles
        ambiance_score: 4,
        affluence_level: 'moyenne',
        created_at: new Date(Date.now() - 30 * 60 * 1000), // 30min ago
      },
      
      // Votes pour Le Fougères (id: 3)
      {
        user_id: 2, // lucas@barexplorer.com
        bar_id: 3,   // Le Fougères
        ambiance_score: 5,
        affluence_level: 'pleine',
        created_at: new Date(Date.now() - 45 * 60 * 1000), // 45min ago
      },
      {
        user_id: 3, // anna@barexplorer.com
        bar_id: 3,   // Le Fougères
        ambiance_score: 4,
        affluence_level: 'pleine',
        created_at: new Date(Date.now() - 15 * 60 * 1000), // 15min ago
      },
    ];

    await queryInterface.bulkInsert('votes', votes);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('votes', {}, {});
  },
};

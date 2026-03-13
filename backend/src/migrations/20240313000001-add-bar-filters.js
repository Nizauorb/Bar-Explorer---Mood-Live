'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bars', 'budget', {
      type: Sequelize.ENUM('€', '€€', '€€€', '€€€€'),
      allowNull: true,
    });

    await queryInterface.addColumn('bars', 'style_musical', {
      type: Sequelize.ENUM('rock', 'electro', 'jazz', 'rap', 'pop', 'reggae', 'salsa', 'variété', 'indé', 'classique'),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bars', 'budget');
    await queryInterface.removeColumn('bars', 'style_musical');
  }
};

import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('bars', [
      {
        name: 'Le Comptoir Général',
        address: '9 Rue du Faubourg du Temple, 75010 Paris',
        latitude: 48.8666,
        longitude: 2.3639,
        description: 'Bar à cocktails ambiance vintage avec musique jazz et soul',
        phone: '+33 1 42 41 05 06',
        website: 'https://lecomptoirgeneral.paris',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'La Cave à Bulles',
        address: '45 Rue de Lancry, 75010 Paris',
        latitude: 48.8682,
        longitude: 2.3615,
        description: 'Spécialiste des bières artisanales et vins naturels',
        phone: '+33 1 42 41 00 31',
        website: 'https://lacaveabulles.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Le Fougères',
        address: '23 Rue de la Fontaine au Roi, 75011 Paris',
        latitude: 48.8628,
        longitude: 2.3696,
        description: 'Bar irlandais authentique avec concerts live et sport',
        phone: '+33 1 43 55 99 00',
        website: 'https://lefougeresparis.com',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Café de la Place',
        address: '7 Place de la République, 75003 Paris',
        latitude: 48.8638,
        longitude: 2.3634,
        description: 'Café branché en plein cœur de la Place de la République',
        phone: '+33 1 42 71 00 00',
        website: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Le Bar du Marché',
        address: '34 Rue Bichat, 75010 Paris',
        latitude: 48.8701,
        longitude: 2.3612,
        description: 'Bar convivial près du marché des Enfants Rouges',
        phone: '+33 1 42 41 12 34',
        website: '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('bars', {
      name: [
        'Le Comptoir Général',
        'La Cave à Bulles', 
        'Le Fougères',
        'Café de la Place',
        'Le Bar du Marché'
      ],
    });
  },
};

const Sequelize = require('sequelize');
const path = require('path');

const dbURL = `sqlite:${path.join(__dirname, 'points_of_interest.db')}`;

const sequelize = new Sequelize(dbURL, {
  define: {
    freezeTableName: true,
    underscored: true
  },
  logging: null
});

const models = {
  poi: sequelize.define('pois', {
    poi_id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    latitude: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    longitude: {
      type: Sequelize.DECIMAL,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  })
};

module.exports = {
  sequelize,
  models
};

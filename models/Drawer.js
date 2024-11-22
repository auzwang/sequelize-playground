const Sequelize = require('sequelize');
const { sequelize, primaryKey } = require('../index');

const Drawer = sequelize.define('drawer', {
    ...primaryKey,
    width: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    height: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    depth: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    material: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    status: {
        type: Sequelize.TEXT,
        defaultValue: 'pending'
    },
    externalId: {
        type: Sequelize.TEXT
    }
}, {
    indexes: [
        {
            fields: ['status']
        },
        {
            fields: ['externalId']
        }
    ]
});

module.exports = Drawer;

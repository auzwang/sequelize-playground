const Sequelize = require('sequelize');
const { sequelize, primaryKey } = require('../index');

const Frame = sequelize.define('frame', {
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
        type: Sequelize.STRING,
        allowNull: false
    },
    slideType: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Type of drawer slides to be installed'
    },
    slidePositions: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'JSON array of drawer slide mounting positions'
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
    }
}, {
    indexes: [
        {
            fields: ['status']
        }
    ]
});

module.exports = Frame;

const Sequelize = require('sequelize');
const { sequelize, primaryKey } = require('../index');

const DrawerSlide = sequelize.define('drawerSlide', {
    ...primaryKey,
    length: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Length of the drawer slide in inches'
    },
    weight_capacity: {
        type: Sequelize.FLOAT,
        allowNull: false,
        comment: 'Maximum weight capacity in pounds'
    },
    extension_type: {
        type: Sequelize.ENUM('full', 'partial', '3/4'),
        allowNull: false,
        comment: 'Type of extension'
    },
    mounting_type: {
        type: Sequelize.ENUM('side', 'under', 'center'),
        allowNull: false,
        comment: 'Type of mounting'
    },
    material: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Material of the drawer slide'
    },
    finish: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Finish of the drawer slide'
    },
    brand: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Brand/manufacturer of the drawer slide'
    },
    model_number: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Model number from manufacturer'
    }
}, {
    indexes: [
        {
            fields: ['model_number'],
            unique: true
        }
    ]
});

module.exports = DrawerSlide;

var express = require("express");
const Sequelize = require('sequelize');
const Frame = require('./models/Frame');
const Drawer = require('./models/Drawer');
const DrawerSlide = require('./models/DrawerSlide');

var app = express();

const sequelize = new Sequelize('name', process.env.SECRET2, null, {
	host: 'localhost',
	dialect: 'postgres',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}

});

const primaryKey = {
	id: {
		type: Sequelize.UUID,
		defaultValue: Sequelize.UUIDV4,
		primaryKey: true
	}
};

const Project = sequelize.define('project', {
	...primaryKey
});

const Route = sequelize.define('route', {
	...primaryKey,
	userId: Sequelize.TEXT,
	status: Sequelize.TEXT,
	externalId: Sequelize.TEXT
}, {
	indexes: [
		{
			fields: ['projectId']
		}
	]
});

Route.belongsTo(Project);

const Stop = sequelize.define('stop', {
	...primaryKey,
	location: Sequelize.GEOMETRY('POINT'),
	etaSeconds: Sequelize.INTEGER,
	status: Sequelize.TEXT,
	externalId: Sequelize.TEXT
}, {
	indexes: [
		{
			fields: ['routeId']
		}
	]
});

Stop.belongsTo(Route);

const Frame = sequelize.define('frame', {
	...primaryKey,
	width: Sequelize.FLOAT,
	height: Sequelize.FLOAT,
	depth: Sequelize.FLOAT,
	material: Sequelize.STRING,
	slideType: Sequelize.STRING,
	slidePositions: Sequelize.JSONB,
	status: Sequelize.STRING
});

const Drawer = sequelize.define('drawer', {
	...primaryKey,
	width: Sequelize.FLOAT,
	height: Sequelize.FLOAT,
	depth: Sequelize.FLOAT,
	material: Sequelize.TEXT,
	status: Sequelize.TEXT,
	externalId: Sequelize.TEXT
});

const syncTables = async () => {
	await Project.sync();
	await Route.sync();
	await Stop.sync();
	await Frame.sync();
	await Drawer.sync();
	await DrawerSlide.sync();
};

(async () => {
	try {
		await sequelize.authenticate();
		console.log('connected');
		await syncTables();
		console.log('tables sync');
	} catch (err) {
		console.log('unable to connect', err);
	}
})();

// Define relationships between Frame, Drawer and DrawerSlide
Frame.hasMany(Drawer);
Drawer.belongsTo(Frame);

Frame.hasMany(DrawerSlide);
DrawerSlide.belongsTo(Frame);

Drawer.hasOne(DrawerSlide);
DrawerSlide.belongsTo(Drawer);

module.exports = {
	sequelize,
	primaryKey
};

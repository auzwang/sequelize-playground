var express = require("express");
const Sequelize = require('sequelize');

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

const syncTables = async () => {
	await Project.sync();
	await Route.sync();
	await Stop.sync();
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

// Error handling for undefined routes (404)
app.use((req, res, next) => {
  res.status(404).json({
	error: 'Not Found',
	message: 'The requested resource was not found'
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
	error: 'Internal Server Error',
	message: ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${ENV} mode`);
});

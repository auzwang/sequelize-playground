var express = require("express");
const Sequelize = require('sequelize');

var app = express();

app.post("/xss", async function (req, res) {
  try {
    // SQL Query with Parameterized Query for Authentication
    const results = await sequelize.query(
      "SELECT * FROM Products WHERE name LIKE :username AND password = :password",
      {
        replacements: {
          username: req.body.username,
          password: req.body.password,
        },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Handle authentication results as needed

    // Securely output user input without XSS vulnerability
    const sanitizedXSSInput = escapeHtml(req.body.xss);
    res.send(sanitizedXSSInput);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Function to safely escape HTML to prevent XSS
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}



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

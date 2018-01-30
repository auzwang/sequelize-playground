const Sequelize = require('sequelize');

const sequelize = new Sequelize('test', 'zwang', null, {
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
      unique: true,
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
      unique: true,
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

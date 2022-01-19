import Sequelize from 'sequelize'
import sequelize from './sequelize.mjs'

const Utilizator = sequelize.define(
  'utilizator',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nume: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
        },
      },
    },
    prenume: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
        },
      },
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    parola: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 30],
        },
      },
    },
    dataNasteri: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    sex: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['M', 'F']],
      },
    },
  },
  { tableName: 'Utilizatori' },
)

const Echipa = sequelize.define(
  'echipa',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    denumire: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
        },
      },
    },
  },
  { tableName: 'Echipe' },
)

const Proiect = sequelize.define(
  'proiect',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    denumire: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
        },
      },
    },
    descriere: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [0, 255],
        },
      },
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  { tableName: 'Proiecte' },
)

const Bug = sequelize.define(
  'bug',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    subiect: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [2, 50],
        },
      },
    },
    descriere: {
      type: Sequelize.STRING,
      validate: {
        len: {
          args: [0, 255],
        },
      },
    },
    prioritate: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['Mica', 'Medie', 'Mare']],
      },
    },
    status: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['nerezolvat', 'rezolvat']],
      },
    },
    linkCommit: {
      type: Sequelize.STRING,
    },
  },
  { tableName: 'Bugs' },
)

// Utilizator.hasMany(Echipa, { foreignKey: "utilizatorId" });
// Echipa.belongsTo(Utilizator, { foreignKey: "utilizatorId" });

Echipa.hasMany(Utilizator, { foreignKey: 'echipaId' })
Utilizator.belongsTo(Echipa, { foreignKey: 'echipaId' })

Echipa.hasMany(Proiect, { foreignKey: 'echipaId' })
Proiect.belongsTo(Echipa, { foreignKey: 'echipaId' })

Utilizator.hasMany(Proiect, { foreignKey: 'utilizatorId' })
Proiect.belongsTo(Utilizator, { foreignKey: 'utilizatorId' })
//Proiect.belongsToMany(Utilizator, { foreignKey: "utilizatorId" });

// Utilizator.hasOne(Bug, { foreignKey: "mpId" });
// Bug.belongsTo(Utilizator, { foreignKey: "mpId" });

// Utilizator.hasOne(Bug, { foreignKey: "tsId" });
// Bug.belongsTo(Utilizator, { foreignKey: "tsId" });

Proiect.hasMany(Bug, { foreignKey: 'proiectId' })
Bug.belongsTo(Proiect, { foreignKey: 'proiectId' })

async function initialize() {
  await sequelizeConexiune.authenticate()
  await sequelizeConexiune.sync({ force: true })
}

export { initialize, Utilizator, Echipa, Proiect, Bug }

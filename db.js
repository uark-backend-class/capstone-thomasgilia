//To Do:
//Import sequelize and all models
//Link libraries with models to create instances (?)
//create relationships between tables/models

const Sequelize = require("sequelize");
// const { Sequelize,DataTypes } = require("sequelize");
//added datatype import per documentation - belongs in db.js only? doesn't matter?
// const UserModel = require('./models/user');
const DocModel = require("./models/doc");
const NoteModel = require("./models/note");
// const NoteDocModel = require("./models/noteDoc");
const ClientModel = require('./models/client');

const sequelize = new Sequelize(process.env.DATABASE_URL);

// const User = UserModel(sequelize, Sequelize);
const Doc = DocModel(sequelize, Sequelize);
const Note = NoteModel(sequelize, Sequelize);
// const NoteDoc = NoteDocModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);

Note.belongsToMany(Doc, { through: "NoteDoc"});
Doc.belongsToMany(Note, { through: "NoteDoc"});

Client.hasMany(Note);
Note.belongsTo(Client);

// Note.create

sequelize.sync().then(() => console.log("Tables are created!"));

module.exports = {
  Note,
  Doc,
//   NoteDoc,
  Client,
};

// readd exports:
// User,


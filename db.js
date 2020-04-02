const Sequelize = require("sequelize");
const DocModel = require("./models/doc");
const NoteModel = require("./models/note");
const ClientModel = require("./models/client");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const Doc = DocModel(sequelize, Sequelize);
const Note = NoteModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);

Note.belongsToMany(Doc, { through: "NoteDoc" });
Doc.belongsToMany(Note, { through: "NoteDoc" });

Client.hasMany(Note);   
Note.belongsTo(Client);

//standard
sequelize.sync().then(() => console.log("Tables are created!"));
// sequelize.sync({force:true}).then(() => console.log("Table data has been cleared!"));
// DROP TABLE DATA

// DROP ALL TABLES - CAUTION
// sequelize.sync().then(() => sequelize.drop());

module.exports = {
  Note,
  Doc,
  Client,
};

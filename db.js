//To Do:
//Link libraries with models to create instances (?)
//create relationships between tables/models

const Sequelize = require("sequelize");
// const { Sequelize,DataTypes } = require("sequelize");
//added datatype import per documentation - belongs in db.js only? doesn't matter?
const UserModel = require("./models/user");
const DocModel = require("./models/doc");
const NoteModel = require("./models/note");
const ClientModel = require("./models/client");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = UserModel(sequelize, Sequelize);
const Doc = DocModel(sequelize, Sequelize);
const Note = NoteModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);

Note.belongsToMany(Doc, { through: "NoteDoc" });
Doc.belongsToMany(Note, { through: "NoteDoc" });

User.belongsToMany(Client, { through: "UserClient", foreignKey: "oClientId" });
Client.belongsToMany(User, { through: "UserClient", foreignKey: "ownerId" });

Client.hasMany(Note);     //notes table has fK = clientID
Note.belongsTo(Client);

//standard
sequelize.sync().then(() => console.log("Tables are created!"));
// sequelize.sync({force:true}).then(() => console.log("Tables are created!"));
// DROP TABLE DATA

//DROP ALL TABLES - CAUTION
// sequelize.sync().then(() => sequelize.drop());

module.exports = {
  Note,
  Doc,
  Client,
  User,
};

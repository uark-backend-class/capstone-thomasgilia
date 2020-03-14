//To Do:
//Link libraries with models to create instances (?)
//create relationships between tables/models

const Sequelize = require("sequelize");
// const { Sequelize,DataTypes } = require("sequelize");
//added datatype import per documentation - belongs in db.js only? doesn't matter?
const UserModel = require("./models/user");
const WorkspaceModel = require("./models/workspace");
const DocModel = require("./models/doc");
const NoteModel = require("./models/note");
const ClientModel = require("./models/client");

const sequelize = new Sequelize(process.env.DATABASE_URL);

const User = UserModel(sequelize, Sequelize);
const Workspace = WorkspaceModel(sequelize, Sequelize);
const Doc = DocModel(sequelize, Sequelize);
const Note = NoteModel(sequelize, Sequelize);
const Client = ClientModel(sequelize, Sequelize);

Note.belongsToMany(Doc, { through: "NoteDoc" });
Doc.belongsToMany(Note, { through: "NoteDoc" });

User.belongsToMany(Client, { through: "UserClient", foreignKey: "oClientId" });
Client.belongsToMany(User, { through: "UserClient", foreignKey: "ownerId" });

Client.hasMany(Note);     //notes table has fK = clientId
Note.belongsTo(Client);

User.hasOne(Workspace);     
Workspace.belongsTo(User);    //workspace table has fK = userId

//standard
sequelize.sync().then(() => console.log("Tables are created!"));
// sequelize.sync({force:true}).then(() => console.log("Table data has been cleared!"));
// DROP TABLE DATA

//DROP ALL TABLES - CAUTION
// sequelize.sync().then(() => sequelize.drop());

module.exports = {
  Note,
  Doc,
  Client,
  User,
  Workspace
};

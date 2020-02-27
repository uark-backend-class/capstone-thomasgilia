module.exports = (sequelize, DataTypes) => {
  return sequelize.define("note", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: DataTypes.ENUM(
      "Financial",
      "Report format",
      "Receives report email",
      "etcetera",
    ),
    subject: DataTypes.STRING,
    note: DataTypes.STRING(1234),
    setUrgent: DataTypes.BOOLEAN,
    flagExpires: DataTypes.DATEONLY,
    docAssociated: DataTypes.BOOLEAN,
    associatedDocId: DataTypes.INTEGER,
    revisionLog: DataTypes.STRING(1234),
    lastUpdateUser: DataTypes.STRING,
    lastUpdate: DataTypes.DATE,
  });
};
//add logging field to note and doc models
// //can add  allowNull: false to each critical category like this
// firstName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//for the special data types, does it need to be sequelize.STRING or      type: DataTypes.STRING?
//later may want to use datatype.ENUM and pass in a variable instead of the list of categories
//categories would be imported as array saved in variable, into note.js from the client.js model?

module.exports = (sequelize, Sequelize) => {
  return sequelize.define("note", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: {type: Sequelize.ENUM(
      "Financial",
      "Report format",
      "Contacts",
      "Project details"
    ), allowNull: false},
    title: { type: Sequelize.STRING, allowNull: false },
    note: { type: Sequelize.TEXT, allowNull: false },
    setUrgent: { type: Sequelize.BOOLEAN, allowNull: false },
    flagExpires: { type: Sequelize.STRING },
    revisionLog: { type: Sequelize.TEXT, allowNull: false },
  });
};

//for the special data types, does it need to be sequelize.STRING or      type: Sequelize.STRING?
//later may want to use datatype.ENUM and pass in a variable instead of the list of categories
//categories would be imported as array saved in variable, into note.js from the client.js model?

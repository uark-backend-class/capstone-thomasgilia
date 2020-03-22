module.exports = (sequelize, Sequelize) => {
  return sequelize.define("doc", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: Sequelize.ENUM(
      "Financial",
      "Report format",
      "Receives report email",
      "Report distribution",
      "Temporary-Project instructions",
      "Client SOP",
      "Internal SOP",
      "Client Manual",
      "Client's Price List"
    ),
    title: Sequelize.STRING,
    origin: Sequelize.STRING,
    // lastUpdate: Sequelize.DATE,
    lastUpdateUser: Sequelize.STRING,
    docPath: Sequelize.STRING,
  });
};

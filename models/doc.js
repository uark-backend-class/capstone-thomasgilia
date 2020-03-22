module.exports = (sequelize, Sequelize) => {
  return sequelize.define("doc", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: Sequelize.STRING,
    title: Sequelize.STRING,
    origin: Sequelize.STRING,
    // lastUpdate: Sequelize.DATE,
    lastUpdateUser: Sequelize.STRING,
    docPath: Sequelize.STRING,
  });
};

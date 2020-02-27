module.exports = (sequelize, Sequelize) => {
  return sequelize.define("client", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ownedByUser: Sequelize.STRING,
    hasOwnPriceList: Sequelize.BOOLEAN,
    linkOwnPriceList: Sequelize.STRING,
    hasOwnManual: Sequelize.BOOLEAN,
    linkOwnManual: Sequelize.STRING,
    hasOwnSOP: Sequelize.BOOLEAN,
    linkOwnSOP: Sequelize.STRING,
    hasFlag: Sequelize.BOOLEAN,
    linkFlag: Sequelize.STRING,
    // revisionLog: Sequelize.STRING(1234),
    lastUpdateUser: Sequelize.STRING,
    // lastUpdate: Sequelize.DATETIME
  });
};

//update flags on notes and just have boolean above tell user to go to notes flags if it is true?

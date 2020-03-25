module.exports = (sequelize, Sequelize) => {
  return sequelize.define("client", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientName: Sequelize.STRING,
    ownedByUser: Sequelize.BOOLEAN,
    ownedBy: Sequelize.STRING,
    keyClient: Sequelize.BOOLEAN,
    reqQuote: Sequelize.BOOLEAN,
    reqQuoteApproval: Sequelize.BOOLEAN,
    standardDiscount: Sequelize.INTEGER,
    revisionLog: Sequelize.TEXT
  });
};


module.exports = (sequelize, Sequelize) => {
  return sequelize.define("client", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    clientName: { type: Sequelize.STRING, allowNull: false },
    ownedByUser: { type: Sequelize.BOOLEAN, allowNull: false },
    ownedBy: { type: Sequelize.STRING, allowNull: false },
    keyClient: { type: Sequelize.BOOLEAN, allowNull: false },
    reqQuote: { type: Sequelize.BOOLEAN, allowNull: false },
    reqQuoteApproval: { type: Sequelize.BOOLEAN, allowNull: false },
    standardDiscount: { type: Sequelize.INTEGER, allowNull: false },
    revisionLog: { type: Sequelize.TEXT, allowNull: false }
  });
};


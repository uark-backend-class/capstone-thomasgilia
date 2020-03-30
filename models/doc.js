module.exports = (sequelize, Sequelize) => {
  return sequelize.define("doc", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: { type: Sequelize.STRING, allowNull: false },
    title: { type: Sequelize.STRING, allowNull: false },
    origin: { type: Sequelize.STRING, allowNull: false },
    docPath: { type: Sequelize.STRING, allowNull: false },
    
  });
};

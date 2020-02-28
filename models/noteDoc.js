module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "noteDoc",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      noteId: DataTypes.INTEGER,
      docId: DataTypes.INTEGER,
    },
    { freezeTableName: true },
  );
};
    
module.exports = (sequelize, Sequelize) => {
    return sequelize.define("workspace", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: Sequelize.STRING,
        lastName: Sequelize.STRING,
        ownedClients: Sequelize.STRING,
        accessLevel: Sequelize.STRING,
        favorites: Sequelize.STRING
    });
};

  //favorites is a placeholder
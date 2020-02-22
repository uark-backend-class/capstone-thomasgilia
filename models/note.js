module.exports = (sequelize, Sequelize) => {
    return sequelize.define('note', {
        id: {
            type: Sequelize.TEXT,
            primaryKey: true,
            autoIncrement: true,
        },
        // category: Sequelize.ENUM('Financial', 'Report format', 'Receives report email', 'etcetera'),
        subject: Sequelize.STRING,
        // note: Sequelize.STRING(1234),
        setUrgent: Sequelize.BOOLEAN,
        // flagExpires: Sequelize.DATEONLY,
        docAssociated: Sequelize.BOOLEAN,
        // revisionLog: Sequelize.STRING(1234),
        lastUpdateUser: Sequelize.STRING,
        // lastUpdate: Sequelize.DATETIME
    }
    );
}
//add logging field to note and doc models
// //can add  allowNull: false to each critical category like this 
// firstName: {
//     type: DataTypes.STRING,
//     allowNull: false
//   },
//for the special data types, does it need to be sequelize.STRING or      type: DataTypes.STRING?
//later may want to use datatype.ENUM and pass in a variable instead of the list of categories
//categories would be imported as array saved in variable, into note.js from the client.js model?
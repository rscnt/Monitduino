module.exports = function(sequelize, DataTypes) {
    var Alert = sequelize.define('Alert', {
        date: DataTypes.DATE,
        priority:  DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Alert.hasOne(models.Data);
                Alert.belongsTo(models.Registry);
            }
        }
    });

    return Alert;
}

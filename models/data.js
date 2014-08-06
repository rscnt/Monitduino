module.exports = function(sequelize, DataTypes) {
    var Data = sequelize.define('Data', {
        max: DataTypes.DECIMAL,
        min: DataTypes.DECIMAL,
        metric: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Data.belongsTo(models.Registry);
            }
        }
    });

    return Data;
}

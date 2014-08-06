module.exports = function(sequelize, DataTypes) {
    var Registry = sequelize.define('Registry', {
        name: DataTypes.STRING,
        date: DataTypes.DATE,
        value: DataTypes.DECIMAL,
    }, {
        classMethods: {
            associate: function(models) {
                Registry.hasOne(models.Data);
                Registry.hasOne(models.Alert);
            }
        }
    });

    return Registry;
}

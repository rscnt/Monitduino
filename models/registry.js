module.exports = function(sequelize, DataTypes) {
    var Registry = sequelize.define('Registry', {
        name: DataTypes.STRING,
        date: DataTypes.DATE,
        value: DataTypes.FLOAT
    }, {
        classMethods: {
            associate: function(models) {
                Registry.belongsTo(models.Data);
                Registry.belongsTo(models.Alert);
            }
        }
    });

    return Registry;
};

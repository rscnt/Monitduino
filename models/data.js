module.exports = function(sequelize, DataTypes) {
    var Data = sequelize.define('Data', {
        name: {type: DataTypes.STRING, unique: true},
        max: DataTypes.DECIMAL,
        min: DataTypes.DECIMAL,
        metric: DataTypes.STRING,
        description: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Data.hasOne(models.Registry);
            }
        }
    });

    return Data;
};

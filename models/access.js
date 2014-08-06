module.exports = function(sequelize, DataTypes) {
    var Access = sequelize.define('Access', {
        date: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                Access.belongsTo(models.User);
            }
        }
    });

   return Access;
};

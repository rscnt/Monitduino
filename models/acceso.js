module.exports = function(sequelize, DataTypes) {
    var Acceso = sequelize.define('Acceso', {
        fecha: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                Acceso.belongsTo(models.Usuario);
            }
        }
    });

   return Acceso;
};

models.exports = function(sequelize, DataTypes) {
    var Alerta = sequelize.define('Alerta', {
        fecha: DataTypes.DATE,
        prioridad:  DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function(models) {
                Alerta.hasOne(models.Dato);
                Alerta.belongsTo(models.Registro);
            }
        }
    });

    return Registro;
}

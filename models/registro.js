models.exports = function(sequelize, DataTypes) {
    var Registro = sequelize.define('Registro', {
        fecha: DataTypes.DATE,
        valor: DataTypes.DECIMAL,
    }, {
        classMethods: {
            associate: function(models) {
                Registro.hasOne(models.Dato);
                Registro.hasOne(models.Alerta);
            }
        }
    });

    return Registro;
}

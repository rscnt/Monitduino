models.exports = function(sequelize, DataTypes) {
    var Dato = sequelize.define('Dato', {
        maximo: DataTypes.DECIMAL,
        minimo: DataTypes.DECIMAL,
        metrica: DataTypes.STRING,
        descripcion: DataTypes.TEXT
    }, {
        classMethods: {
            associate: function(models) {
                Dato.belongsTo(models.Registro);
            }
        }
    });

    return Dato;
}

module.exports = function(sequelize, DataTypes) {
    var Usuario = sequelize.define('Usuario', {
        username: {type: DataTypes.STRING, unique: true},
        password: DataTypes.STRING,
        cargo: DataTypes.STRING,
        description: DataTypes.TEXT,
        nacimiento: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                Usuario.hasMany(models.Acceso);
            }
        }
    });

   return Usuario;
};

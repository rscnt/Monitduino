module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: {type: DataTypes.STRING, unique: true},
        password: DataTypes.STRING,
        charge: DataTypes.STRING,
        description: DataTypes.TEXT,
        birthdate: DataTypes.DATE
    }, {
        classMethods: {
            associate: function(models) {
                User.hasMany(models.Access);
            }
        }
    });

   return User;
};

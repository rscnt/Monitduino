var fs      = require('fs'),
path      = require('path'),
Sequelize = require('sequelize'), /* Instance of Squelize. */
lodash    = require('lodash'),
sequelize = new Sequelize('monitdb', 'henan', null), /* Instace of the virtual db */
db        = {};

fs.readdirSync(_dirname).filter(function(file){
    return (file.indexOf('.') !== 0 && (file !== 'index.js'));
}).forEach(function(file){
    var model = sequelize.import(path.join(_dirname, file));
    db[mode.name] = model;
});

Object.keys(db).forEach(function(modelName) {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

module.exports = lodash.extend({
    sequelize: sequelize,
    Sequelize: Sequelize
}, db); /** _.sequelize */

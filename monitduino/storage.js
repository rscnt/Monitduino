/**
 * monitduino.storage. 
 * Implements functionality to store data with sequelize and parse. 
 * */

var db         = require('../models');

var storage = exports = module.exports;

/**
 * @param integer dataID,  name of the table or registry to save.
 * @param decimal dataValue, decimal with the value returned.
 * @return object, a Registry new instance.
*/
storage.createRegistry = function(dataID, dataValue) {
    var registry = undefined;
    db.Data.find({
        where: {
            id: dataID
        }
    }, function(data) {
        // se intenta crear un registro.
        db.Registry.create({
            date: Date.now(),
            value: dataValue,
        }).success( function(registry) {
            // el registro ha sido guardado, se asocia la entidad data.
            registry.setData(data).success(function(){
                //Out of this hell.
                registry = registry;
            });
        });
    });
    return registry;
};

/**
 * Stores an alert and sends it to parse.
 * @param integer dataID, the data id.
 * @param decimal value, the data value.
 * @param integer level, the level value.  
 * @return object, a new alert object.
*/
storage.storeAlert = function (dataID, value, level) {
    var alert = undefined;
    db.Data.find({
        where: {
            id: dataID
        }
    }, function(data) {
        // se intenta crear un registro.
        db.Alert.create({
            date: Date.now(),
            value: dataValue,
            level: level
        }).success( function(alert) {
            // el registro ha sido guardado, se asocia la entidad data.
            alert.setData(data).success(function(){
                //Out of this hell.
                switch(alert.level) {
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    default:
                        break;
                }
                alert = alert;
            });
        });
    });
    return alert;
}

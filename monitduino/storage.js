/**
 * monitduino.storage. 
 * Implements functionality to store data with sequelize and parse. 
 * */

var db   = require('../models');
var Parse = require('parse').Parse;

module.exports = Storage;

function Storage() {
    Parse.initialize("xpt9oXP4BTzvh2PlhMBNZolQg5o72SpF5HPxrB6a", "pG8XiyyD1CzNo4BpzpKNnZ1INg0TDXmdmAKqYZlM");
    Parse.Access   = Parse.Object.extend("Access");
    parse.Alert    = Parse.Object.extend("Alert");
    parse.Data     = Parse.Object.extend("Data");
    parse.Registry = Parse.Object.extend("Registry");
    parse.User     = Parse.Object.extend("User");
};

var parse = {
    Data     : undefined,
    Registry : undefined,
    User     : undefined,
    Alert    : undefined,
    Access   : undefined
}

var StorageData = function (schema, parseObject, referenceID) {
    this.schema : schema;
    this.parseObject: parseObject;
    this.referenceID: referenceID;
    db.Data.create({
        name: this.schema.name,
        max: this.schema.max,
        min: this.schema.min,
        metric: this.schema.metric
    }).success(function(data){
    });
    return this;
};

var Data  = {
    Temperatura : {
        schema: {
            "name": "temperatura",
            "max": 24.0,
            "min": 12.0,
            "metric": "Celsius"
        },
        parse : undefined,
        referenceID: undefined
    },
    Humedad : {
        schema : {
            "name": "humedad",
            "max": 100.0,
            "min": 0.0,
            "metric": "Percentage"
        },
        parse: undefined,
        referenceID: undefined
    },
    Liquido : {
        schema : {
            "name": "liquido",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        },
        parse: undefined,
        referenceID: undefined
    },
    Humo : {
        schema: {
            "name": "humo",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        },
        parse: undefined,
        referenceID: undefined
    }
};

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
                if (parse.Registry !== undefined) {
                    parseRegistry = new Registry();
                    parseRegistry.set("date", registry.date);
                    parseRegistry.set("value", registry.value);
                    parseRegistry.set("parent", data.remoteID);
                    parseRegistry.save(null, function(parseRegistry){
                        registry.update({remoteID: parseRegistry.id});
                    });
                }
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
};

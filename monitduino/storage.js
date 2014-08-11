/**
 * monitduino.storage. 
 * Implements functionality to store data with sequelize and parse. 
 * */

var db   = require('../models');
var Parse = require('parse').Parse;
var _ = require("lodash");
var socketIO;

var parse = {
    Data     : undefined,
    Registry : undefined,
    User     : undefined,
    Alert    : undefined,
    Access   : undefined
};

/*
 *
 */
var createData = function (schema, parseObject, referenceID) {
    db.Data 
    .find({ where: { name: schema.name  }  })
    .complete(function(err, data) {
        if (!!err) {
            console.log("Error on QUERY");
        } else if (!data) {
            console.log(data);
            // No data found.
            db.Data.create({
                name: schema.name,
                max: schema.max,
                min: schema.min,
                metric: schema.metric
            }).success(function(data){
                return data;
            });
        } else {
            schema.name   = data.selectedValue.name;
            schema.max    = data.selectedValue.max;
            schema.min    = data.selectedValue.min;
            schema.metric = data.selectedValue.metric;
        }

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

function Storage(io) {
    Parse.initialize("xpt9oXP4BTzvh2PlhMBNZolQg5o72SpF5HPxrB6a", "pG8XiyyD1CzNo4BpzpKNnZ1INg0TDXmdmAKqYZlM");
    parse.Access   = Parse.Object.extend("Access");
    Parse.Alert    = Parse.Object.extend("Alert");
    Parse.Data     = Parse.Object.extend("Data");
    Parse.Registry = Parse.Object.extend("Registry");
    Parse.User     = Parse.Object.extend("User");
    socketIO = io;
}


/**
 *
 * */
Storage.data = {
    Celsius: "temperatura",
    Humedad: "humedad"
};

Storage.prototype.initStorage = function() {
    _.forEach(Data, function(data){
        createData(data.schema, undefined, undefined);
    });
};

/**
 * @param integer dataID,  name of the table or registry to save.
 * @param decimal dataValue, decimal with the value returned.
 * @return object, a Registry new instance.
 */
Storage.prototype.createRegistry = function(dataName, dataValue) {
    var that = this;
    var aRegistry;
    db.Data 
    .find({ where: { name: dataName  }  })
    .complete(function(err, data) {
        if (!!err) {
            console.log("Error on QUERY");
        } else if (!data) {
            console.log('Data ' + dataName + 'not found');
        } else {
            // se intenta crear un registro.
            db.Registry.create({
                name: dataName,
                date: Date.now(),
                value: dataValue,
            }).success(function(registry) { 
                socketIO.emit('general' , {name: registry.name, value: registry.value});
                // el registro ha sido guardado, se asocia la entidad data.
                registry.setDatum(data).success(function(){
                    if (registry.value >= data.max) {
                        that.storeAlert(registry.id, 1);
                    }
                    //Out of this hell.
                    if (parse.Registry !== undefined) {
                        var parseRegistry = new parse.Registry();
                        parseRegistry.set("date"   , registry.date);
                        parseRegistry.set("value"  , registry.value);
                        parseRegistry.set("parent" , data.remoteID);
                        parseRegistry.save(null , function(parseRegistry){
                            registry.update({remoteID: parseRegistry.id});
                        });
                    }
                    aRegistry = registry;
                });
            });
        }
    });
    return aRegistry;
};

/**
 * Stores an alert and sends it to parse.
 * @param integer dataID, the data id.
 * @param decimal value, the data value.
 * @param integer level, the level value.  
 * @return object, a new alert object.
 */
Storage.prototype.storeAlert = function (registryID, priority) {
    var anAlert;
    db.Registry.find({where: {id: registryID}})
    .complete(function(err, registry){
        if (!!err) {
            console.log(err);
        } else if (!registry)  {
            console.log(registry);
        } else {
            db.Alert.create({
               priority: priority,
               date: Date.now()
            }).success(function(alert){
                anAlert = alert;
                alert.setRegistry(registry)
                    .success(function(){
                        if (parse.Alert !== undefined) {
                            var parseAlert = new parse.Alert();
                            parseAlert.set("date", alert.date);
                            parseAlert.set("priority", alert.priority);
                            parseAlert.set("value", registry.value);
                            parseAlert.set("name", registry.name);
                            parseAlert.save(null, function(parseAlertRemote){
                                alert.update({remoteID: parseAlertRemote.id});
                            });
                        }
                    });
            });
        }
    });
    return anAlert;
};

module.exports = Storage;

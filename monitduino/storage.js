/**
 * monitduino.storage. 
 * Implements functionality to store data with sequelize and parse. 
 * */

var db   = require('../models');
var Parse = require('parse').Parse;
var _ = require("lodash");
var temp_p = new Array();
var hum_p = new Array();

var parse = {
    Data     : undefined,
    Registry : undefined,
    User     : undefined,
    Alert    : undefined,
    Access   : undefined
};


function Storage () {
    Parse.initialize("xpt9oXP4BTzvh2PlhMBNZolQg5o72SpF5HPxrB6a", "pG8XiyyD1CzNo4BpzpKNnZ1INg0TDXmdmAKqYZlM");
    parse.Access   = Parse.Object.extend("Access");
    parse.Alert    = Parse.Object.extend("Alert");
    parse.Data     = Parse.Object.extend("Data");
    parse.Registry = Parse.Object.extend("Registry");
    parse.User     = Parse.Object.extend("User");
}

/*
 *
 */
var createData = function (schema, parseObject, referenceID) {
    db.Data 
    .find({ where: { name: schema.name  }  })
    .complete(function(err, data) {
        if (!!err) {
	    console.log("ERROR");
	    console.log(err);
	    throw err;
        } else if (!data) {
            // No data found.
            db.Data.create({
                name: schema.name,
                max: schema.max,
                min: schema.min,
                metric: schema.metric
            }).complete(function(err, data){
		if (!!err) { console.log("ERROR ON DATA"); console.log(err); }
		console.log(data);
            });
        } else {
            schema.name   = data.name;
            schema.max    = data.max;
            schema.min    = data.min;
            schema.metric = data.metric;
        }

    });
    return this;
};

Storage.schemas  = {
    Temperatura : {
        schema: {
            "name": "temperatura",
            "max": 40.0,
            "min": 12.0,
            "metric": "Celsius"
        },
        parse : undefined,
        referenceID: undefined
    },
    Humedad : {
        schema : {
            "name": "humedad",
            "max": 80.0,
            "min": 0.0,
            "metric": "Percentage"
        },
        parse: undefined,
        referenceID: undefined
    },
    LiquidoA: {
        schema : {
            "name": "liquidoA",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        },
        parse: undefined,
        referenceID: undefined
    },
    LiquidoB: {
        schema : {
            "name": "liquidoB",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        },
        parse: undefined,
        referenceID: undefined
    },
    LiquidoC: {
        schema : {
            "name": "liquidoC",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        },
        parse: undefined,
        referenceID: undefined
    },
    Puerta : {
        schema : {
            "name": "principal",
            "metric": "datos"
        },
        parse: undefined,
        referenceID: undefined
    },
    Usuario : {
        schema : {
            "name": "usuario",
            "estado": "seguro",
            "metric": "datos"
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
    },
    Luz_1 : {
        schema: {
            "name": "luz_1",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        }
    },
    Luz_2 : {
        schema: {
            "name": "luz_2",
            "max": 1.0,
            "min": 0.0,
            "metric": "Boolean"
        }
    }
};


/**
 *
 * */
Storage.data = {
    Celsius: "temperatura",
    Humedad: "humedad",
    Liquido: "liquido",
    Humo: "humo",
    Puerta: "principal",
    LiquidoA: "liquidoA",
    LiquidoB: "liquidoB",
    LiquidoC: "liquidoC",
    Humo: "humo",
    Usuario: "usuario",
    Luz_1: "luz_1"
    Luz_2: "luz_2"

};

// should be on a module
var channels = {
    USERNEW : "user_new"
};

Storage.prototype.init = function() {
    var that = this;
    console.log(Storage.schemas);
    _.forEach(Storage.schemas, function(data){
        createData(data.schema, undefined, undefined);
    });
};

/**
The callback accepts an error and the result data.
*/
Storage.prototype.findDataByName = function(name, callback) {
    db.Data 
    .find({ where: { name: name  }  })
    .complete(function(err, data) {
        if (!!err) {
            callback(err, null);
        } else if (!data) {
            callback(null, null);
        } else {
            callback(null, data);
        }
    });
};

Storage.prototype.createUser = function(username, password, charge, description, birthdate) {
    db.User.create({
	username: username,
	password: password,
	charge: charge,
	description: description,
	birthdate: birthdate
    }).success(function(newuser) {
	return true;
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
            console.log('Data ' + dataName + ' not found');
        } else {
            // se intenta crear un registro.
            db.Registry.create({
                name: dataName,
                date: Date.now(),
                value: dataValue
            }).success(function(registry) { 
                switch(registry.name){
                    case "Temperatura":
                    case "temperatura":
                        temp_p.push(registry.value);
                        break;
                    case "Humedad":
                    case "humedad":
                        hum_p.push(registry.value);
                        break;
                }
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

module.exports = {
  up: function(migration, DataTypes, done) {
    // add altering commands here, calling 'done' when finished
      migration.createTable(
          'Registro',
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              createdAt: {
                  type: DataTypes.DATE
              },
              udpatedAt: {
                  type: DataTypes.DATE
              },
              valor: {
                  type: DataTypes.DECIMAL
              },
              dato_id: {
                  type: DataTypes.INTEGER
              }
          }
      );
      migration.createTable(
          'Usuario',
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              createdAt: {
                  type: DataTypes.DATE
              },
              udpatedAt: {
                  type: DataTypes.DATE
              },
              cargo: {
                  type: DataTypes.STRING
              },
              alias: {
                  type: DataTypes.STRING
              },
              clave: {
                  type: DataTypes.STRING
              },
              description: {
                  type: DataTypes.TEXT
              },
              nacimiento: {
                  type: DataTypes.DATE
              }
          });
      migration.createTable(
          'Acceso',
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              createdAt: {
                  type: DataTypes.DATE
              },
              udpatedAt: {
                  type: DataTypes.DATE
              },
              usuario_id: {
                  type: DataTypes.INTEGER
              },
              fecha: {
                  type: DataTypes.DATE
              }          
          });
      migration.createTable(
          'Dato',
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              createdAt: {
                  type: DataTypes.DATE
              },
              udpatedAt: {
                  type: DataTypes.DATE
              },
              usuario_id: {
                  type: DataTypes.INTEGER
              },
              max: {
                  type: DataTypes.DECIMAL
              },
              min: {
                  type: DataTypes.DECIMAL
              },
              metrica: {
                  type: DataTypes.STRING
              },
              descripcion: {
                  type: DataTypes.TEXT
              }
          });
      migration.createTable(
          'Alerta',
          {
              id: {
                  type: DataTypes.INTEGER,
                  primaryKey: true,
                  autoIncrement: true
              },
              createdAt: {
                  type: DataTypes.DATE
              },
              udpatedAt: {
                  type: DataTypes.DATE
              },
              usuario_id: {
                  type: DataTypes.INTEGER
              },
              prioridad: {
                  type: DataTypes.INTEGER
              },
              fecha: {
                  type: DataTypes.DATE
              },
              dato_id: {
                  type: DataTypes.INTEGER
              },
              registro_id: {
                  type: DataTypes.INTEGER
              }
          });
    done()
  },
  down: function(migration, DataTypes, done) {
    // add reverting commands here, calling 'done' when finished
    done()
  }
}

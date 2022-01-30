const getDb = require('../db');
let db = null;
class Expedientes {

  constructor() {
    getDb()
    .then( (database) => {
      db = database;
      if (process.env.MIGRATE === 'true') {
        const createStatement = 'CREATE TABLE IF NOT EXISTS expedientes (id INTEGER PRIMARY KEY AUTOINCREMENT, identidad TEXT, fecha TEXT, descripcion TEXT, observacion TEXT, registros INTEGER , ultimoActualizacion TEXT);';
        db.run(createStatement);
      }
    })
    .catch((err) => { console.error(err)});
  }

  newExpediente ( identidad, fecha, descripcion, observacion, registros, ultimoActualizacion) {
    return new Promise( (accept, reject)=> {
      db.run(
        'INSERT INTO expedientes (identidad, fecha, descripcion, observacion, registros, ultimoActualizacion) VALUES (?, ?, ?, ?, ?, ?);',
        [identidad, fecha, descripcion, observacion, registros, ultimoActualizacion],
        (err, rslt)=>{
          if(err) {
            console.error(err);
            reject(err);
          }
          accept(rslt);
        }
      );
    });
  }

  getAllExpedientes(){
      return new Promise ((accept, reject)=>{
        db.all('SELECT * from expedientes;', (err, rows) =>{
            if(err){
                console.error(err);
                reject(err);
            } else {
                accept(rows);
            }
        });
      });
  }

  getById(id){
    return new Promise ((accept, reject)=>{
      db.get('SELECT * from expedientes where id=?;',
      [id],
      (err, row) =>{
          if(err){
              console.error(err);
              reject(err);
          } else {
              accept(row);
          }
      });
    });
}

updateOneExpediente(id, identidad, fecha, descripcion, observacion, registros, ultimoActualizacion){
  return new Promise ((accept, reject)=>{
    const sqlUpdate = 'UPDATE expedientes set identidad = ?, fecha = ?, descripcion = ?, observacion = ?, registros = ?, ultimoActualizacion= ?  where id = ?';
    db.run(sqlUpdate,
    [identidad, fecha, descripcion, observacion, registros, ultimoActualizacion, id ],
    function (err) {
      if(err){
        reject(err)
      } else {
        accept(this)
      }
    }
    )
  });
}

deleteOneExpediente(id){
  return new Promise ((accept, reject)=>{
    const sqlDelete = 'DELETE FROM expedientes where id = ?';
    db.run(sqlDelete,
    [id],
    function (err) {
      if(err){
        reject(err)
      } else {
        accept(this)
      }
    }
    )
  });
}
}

module.exports = Expedientes;
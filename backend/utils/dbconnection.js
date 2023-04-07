import util from 'util';
import mysql from 'mysql';

export default function createConncention( config ) {
  const connection = mysql.createConnection( config );
  connection.connect(function(err) {
    if (err) throw err;
    console.log("🚀 Connected to DB");
  });
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}
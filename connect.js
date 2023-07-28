

let mysql = require('mysql');


    let connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'charity'
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log('Database is connected successfully !');
      });
      module.exports = connection;
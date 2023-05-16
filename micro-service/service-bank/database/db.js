const mysql = require('mysql');

const nameDatabase = 'service-bank';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3307,
    user: 'user',
    password: 'password',
    database: nameDatabase,
    multipleStatements: true
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Database connected : ' + nameDatabase);
});

module.exports = connection;

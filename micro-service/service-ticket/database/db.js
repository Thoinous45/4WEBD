const mysql = require('mysql');

const nameDatabase = 'service-ticket';

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
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

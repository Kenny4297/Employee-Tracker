const mysql = require('mysql2');
const cTable = require('console.table');

//Connection 
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'sql123',
      database: 'employee_tracker'
    },
    console.log(`Connected to the classlist_db database.`)
);

//Add employee
db.query()
const express = require ('express');
const app = express();
const port = 3000;
const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'nodedb' 
};

const mysql = require('mysql');
const connection = mysql.createConnection(config);

async function insertPeopleIntoDatabase(name, connection) {
    const sql = `INSERT INTO names(name) VALUES(?)`;
    await connection.query(sql, [name]);
    connection.end();
}

async function getAllPeopleFromDatabase(connection) {
    const sql = 'SELECT name FROM names';
    const rows = await connection.query(sql);
    connection.end();
 
    return rows;
}





app.get('/', (req, res) => {
    res.send('<h1> Full Cycle Rocks! </h1>');
})

app.listen(port, () => {
    console.log("Rodando na porta -> ", port);
})

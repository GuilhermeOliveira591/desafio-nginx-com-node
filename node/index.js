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
let connection;

function queryAsync(sql, values) {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
}

(async function initialize() {
    try {
        // Cria uma conexão com o banco de dados
        connection = mysql.createConnection(config);
        connection.connect(); // Conecta ao banco de dados

        console.log('Conectado ao banco de dados.');

        // Insere dados no banco de dados quando o servidor iniciar
        await insertPeopleIntoDatabase(connection);

    } catch (error) {
        console.error('Erro ao iniciar o servidor:', error);
    }
})();

async function insertPeopleIntoDatabase(connection) {
    const names = ['Guilherme', 'Luiz', 'Leonan', 'Pierry', 'Samay', 'Miri'];

    try {
        const sql = 'INSERT INTO people(name) VALUES (?)';
        // Insere todos os nomes em paralelo
        await Promise.all(names.map(name => queryAsync(sql, [name])));
        console.log('Todos os nomes foram inseridos com sucesso.');
    } catch (error) {
        console.error('Erro ao inserir nomes:', error);
    }
}

async function getAllPeopleFromDatabase() {
    const sql = 'SELECT name FROM people';
    
    try {
        const rows = await queryAsync(sql);
        return rows;
    } catch (error) {
        console.error('Erro ao recuperar nomes:', error);
        throw error;
    }
}

app.get('/', async (req, res) => {
    try {
        const people = await getAllPeopleFromDatabase();
        let html = '<h1>Full Cycle Rocks!</h1><ul>';
        
        people.forEach(person => {
            html += `<li>${person.name}</li>`;
        });
        
        html += '</ul>';
        res.send(html);
    } catch (error) {
        res.status(500).send('Erro ao recuperar dados do banco de dados.');
    }
});

app.listen(port, () => {
    console.log("Rodando na porta -> ", port);
})

const express = require('express')
const bodyParser = require('body-parser');
const mariadb = require('mariadb');
const cors = require('cors')

const app = express()
const port = 6093
const pool = mariadb.createPool({ host: 'database.solavo.net', user: 'hien_do_an', connectionLimit: 5, database: 'hien_do_an', password: 'hien_do_an' });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: '*' }));

app.post('/', (req, res) => {
    const { type, date } = req.body;
    pool.getConnection()
        .then(conn => {
            conn.query(`SELECT value as y,cast(updated_time as time) as label FROM ${type} WHERE updated_time between '${date}' and '${date} 23:59:59' ORDER BY updated_time ASC`)
                .then((rows) => {
                    res.send(rows);
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    res.send({});
                    conn.end();
                })
        }).catch(err => {
            console.log(err);
        });
});

app.post('/range/set', (req, res) => {
    const { minPh, maxPh, minEc, maxEc } = req.body;
    pool.getConnection()
        .then(conn => {
            conn.query(`UPDATE setting SET min_ph=?,max_ph=?,min_ec=?,max_ec=?`, [minPh, maxPh, minEc, maxEc])
                .then((rows) => {
                    res.send({ status: true });
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    res.send({ status: false });
                    conn.end();
                })
        }).catch(err => {
            console.log(err);
        });
})

app.post('/range/get', (req, res) => {
    const { minPh, maxPh, minEc, maxEc } = req.body;
    pool.getConnection()
        .then(conn => {
            conn.query(`UPDATE setting SET min_ph=?,max_ph=?,min_ec=?,max_ec=?`, [minPh, maxPh, minEc, maxEc])
                .then((rows) => {
                    res.send({ status: true });
                    conn.end();
                })
                .catch(err => {
                    console.log(err);
                    res.send({ status: false });
                    conn.end();
                })
        }).catch(err => {
            console.log(err);
        });
})

app.listen(port, () => console.log(`Server running on port ${port}!`))
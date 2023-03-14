const { db } = require('../config/db');
const mysql = require('mysql2/promise');

class Pacient {
    constructor(name = '', age = 0, illness ='') {
        this.name = name;
        this.age = age;
        this.illness = illness;
    }

    async createPacient() {
        const sql = `INSERT INTO trement.pacient(name,age,illness) VALUES (?,?,?);`;
        const param = [this.name, this.age, this.illness];

        return db.query(sql,param);
    }


    static getPacientInfo(idpacient) {
        const sql = `SELECT * FROM trement.pacient WHERE idpacient = ?;`;
        const param = [idpacient];

        return db.query(sql,param);
    }

    static getPacientReport(idpacient) {
        const sql = `SELECT * FROM trement.treatment WHERE pacient = ? AND appliedBy IS NOT NULL;`;
        const param = [idpacient];

        return db.query(sql,param);
        
    }

    async updatePacient(idpacient) {
        const sql = `UPDATE trement.pacient SET name = ? ,age = ? ,illness = ? WHERE idpacient = ?`;
        const param = [this.name, this.age, this.illness, idpacient];

        return db.query(sql,param);
    }

    async deletePacient(idpacient) {
        const queries = [
            {
                query: 'UPDATE trement.treatment SET pacient = NULL WHERE pacient = ?;',
                parameters: [idpacient]
            },
            {
                query: 'DELETE FROM trement.pacient WHERE idpacient = ?;',
                parameters: [idpacient]
            }
        ];

        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
        });

        try{
            await connection.beginTransaction();
            await connection.query(queries[0].query, queries[0].parameters);
            await connection.query(queries[1].query, queries[1].parameters);
            await connection.commit();
            connection.destroy();
            return;
        } catch(err) {
            connection.rollback();
            connection.destroy();
            return err.code;
        }
    }

    async assignAssistant(idpacient, idemployee) {
        const sql = `UPDATE trement.pacient SET assistantAssigned = ? WHERE idpacient = ?;`;
        const param = [idemployee,idpacient];

        return db.query(sql,param);
    }
}

module.exports = Pacient;
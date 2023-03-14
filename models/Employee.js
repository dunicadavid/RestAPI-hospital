const { db } = require('../config/db');
const mysql = require('mysql2/promise');

class Employee {
    constructor(name = '', role = '') {
        this.name = name;
        this.role = role;
    }

    async registerEmployee(email, password) {
        const queries = [
            {
                query: 'INSERT INTO trement.registration(email, password) VALUES ( ?, ?);',
                parameters: [email, password]
            },
            {
                query: 'INSERT INTO trement.employee (idemployee, name, role) values (LAST_INSERT_ID(),?,?);',
                parameters: [this.name, this.role]
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

    static getEmployeeByEmail(email) {
        const sql = `SELECT * FROM trement.registration WHERE email = ?;`;
        const param = [email];

        return db.query(sql,param);
    }

    static getEmployeeInfo(idemployee) {
        const sql = `SELECT * FROM trement.employee WHERE idemployee = ?;`;
        const param = [idemployee];

        return db.query(sql,param);
    }

    static getDoctors() {
        const sql = `SELECT * FROM trement.employee WHERE role = ?;`;
        const param = ['Doctor'];

        return db.query(sql,param);
    }

    async updateEmployee(idemployee) {
        const sql = `UPDATE trement.employee SET name = ?, role = ? WHERE idemployee = ?`;
        const param = [this.name, this.role, idemployee];

        return db.query(sql,param);
    }

    async deleteEmployee(idemployee) {

        const queries = [
            {
                query: 'delete from trement.employee where idemployee = ?;',
                parameters: [idemployee]
            },
            {
                query: 'delete from trement.registration where idregistration = ?;',
                parameters: [idemployee]
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
            return;
        } catch(err) {
            connection.rollback();
            return err.message;
        }
    }
}

module.exports = Employee;
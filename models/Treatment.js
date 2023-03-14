const { db } = require('../config/db');

class Treatment {
    constructor(description = '', date = '', doctor ='', pacient='') {
        this.description = description;
        this.date = date;
        this.doctor = doctor;
        this.pacient = pacient;
    }

    async createTreatment() {
        const sql = `INSERT INTO trement.treatment(description,date,doctor,pacient) VALUES (?,?,?,?);`;
        const param = [this.description, this.date, this.doctor, this.pacient];

        return db.query(sql,param);
    }


    static getTreatmentInfo(idtreatment) {
        const sql = `SELECT * FROM trement.treatment WHERE idtreatment = ?;`;
        const param = [idtreatment];

        return db.query(sql,param);
    }

    static getTreatmentsOfDoctor(idemployee) {
        const sql = `SELECT * FROM trement.treatment WHERE doctor = ?;`;
        const param = [idemployee];

        return db.query(sql,param);
    }

    async updateTreatment(idtreatment) {
        const sql = `UPDATE trement.treatment SET description = ? , date = ? , doctor = ? , pacient = ? WHERE idtreatment = ?`;
        const param = [this.description, this.date, this.doctor, this.pacient, idtreatment];

        return db.query(sql,param);
    }


    async deleteTreatment(idtreatment) {
        const sql = `delete from trement.treatment where idtreatment = ?`;
        const param = [idtreatment];

        return db.query(sql,param);
    }

    async applied(idtreatment, idemployee) {
        const sql = `UPDATE trement.treatment SET appliedBy = ? WHERE idtreatment = ?;`;
        const param = [idemployee,idtreatment];

        return db.query(sql,param);
    }
}

module.exports = Treatment;
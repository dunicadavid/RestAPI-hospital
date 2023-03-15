const { db } = require('../config/db');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');

class Middleware {
    async decodeToken(req, res, next) {
        let token = req.headers.authorization;
        try {
            if (token) {
                token = token.slice(7);
                jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ success: 0, message: "Access Denied. Token not valid."});
                    } else {
                        next();
                    }
                });
            } else {
                return res.status(401).json({ success: 0, message: "Access Denied. Provide JWT token."});
            }
        } catch (err) {
            console.log(err);
            return res.json({ success: 0, message: "Internal Error." });
        }
    }

    authorizeCheck = (permissions) => {
        return async (req, res, next) => {
            const token = req.headers.authorization.slice(7);
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ success: 0, message: "Access Denied. Token not valid."});
                } else {
                    let [result, _] = await Employee.getEmployeeInfo(decoded.idregistration);
                    if(permissions.includes(result[0].role)) {
                        next();
                    }
                    else {
                        return res.status(401).json({ success: 0, message: "Unauthorized. You don't have the previlages."});
                    }
                }
            });
        }
    }

    async verifyIfIdIsAssistant(req, res, next) {
        const { idemployee } = req.body;
        try {
            if (typeof idemployee !== 'number') {
                res.status(422).json({ message: 'Id must be a number.' });
            } else {
                let [result, _] = await Employee.getEmployeeInfo(idemployee);
                if(result.length === 0) {
                    res.status(422).json({ message: 'There is no Employee with that Id.' });
                } else {
                    if(result[0].role !== 'Assistant') {
                        res.status(422).json({ message: `Employee with id#${idemployee} is not an assistant.` });
                    } else {
                        next();
                    }
                }
            }
        } catch (err) {
            console.log(err);
            return res.json({ success: 0, message: "Internal Error." });
        }
    }

    async verifyIfIdIsDoctor(req, res, next) {
        const { doctor } = req.body;
        try {
            if (typeof doctor !== 'number') {
                res.status(422).json({ message: 'Id must be a number.' });
            } else {
                let [result, _] = await Employee.getEmployeeInfo(doctor);
                if(result.length === 0) {
                    res.status(422).json({ message: 'There is no Employee with that Id.' });
                } else {
                    if(result[0].role !== 'Doctor') {
                        res.status(422).json({ message: `Employee with id#${doctor} is not an doctor.` });
                    } else {
                        next();
                    }
                }
            }
        } catch (err) {
            console.log(err);
            return res.json({ success: 0, message: "Internal Error." });
        }
    }
}

module.exports = new Middleware();
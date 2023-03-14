const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");

const Employee = require('../models/Employee');
const Treatment = require('../models/Treatment');

exports.registerEmployee = async (req, res, next) => {
    try {
        const { name, role, email } = req.body;
        let { password } = req.body;

        //input integrity check//
        const roleValidation = ['General manager', 'Doctor', 'Assistant'];
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            res.status(422).json({ message: 'Email not valid.' });
        } else if (!name.match(/^[A-Za-z\s]*$/)) {
            res.status(422).json({ message: 'Name is not valid.' });
        } else if (!roleValidation.includes(role)) {
            res.status(422).json({ message: 'The role is not valid.' });
        } else if (password.length < 6) {
            res.status(422).json({ message: 'Password has to have +6 characters.' });
        } else {
            const salt = genSaltSync(10);
            password = hashSync(password, salt);
            let employee = new Employee(name, role);

            employee = await employee.registerEmployee(email, password);

            if (employee == 'ER_DUP_ENTRY') {
                res.status(500).json({ message: 'Email is already in-use' });
            } else {
                res.status(201).json({ message: 'Employee Created Successfully' });
            }
        }
    } catch (error) {

        console.log(error);
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        //input integrity check//
        if (!email.match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            res.status(422).json({ message: 'Email not valid.' });
        } else if (password.length < 6) {
            res.status(422).json({ message: 'Password has to have +6 characters.' });
        } else {
            let [result, _] = await Employee.getEmployeeByEmail(email);
            if (result.length == 1) {
                if (compareSync(password, result[0].password)) {
                    result[0].password = undefined;
                    const jsontoken = sign(result[0], process.env.JWT_SECRET, {
                        expiresIn: "1h"
                    });
                    return res.status(200).json({
                        success: 1,
                        message: "Login successfully",
                        token: jsontoken
                    });
                } else {
                    return res.status(200).json({
                        success: 0,
                        message: "Password and email doesn't match"
                    });
                }
            }
            else {
                res.status(200).json({
                    success: 0,
                    message: `Invalid email`
                });
            }
        }
    } catch (error) {
        console.log(error);
        next(error);
    }

}

exports.getEmployeeInfo = async (req, res, next) => {
    try {
        const idemployee = req.params.id;

        //input integrity check//
        if (!idemployee.match(/^\d+$/)) {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            let [result, _] = await Employee.getEmployeeInfo(parseInt(idemployee));
            if (result.length > 0)
                res.status(200).json({ message: 'Get Employee Info Successfully', employee: result[0] });
            else
                res.status(406).json({ message: `There is no Employee with id: ${idemployee}` });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getEmployeeReport = async (req, res, next) => {
    const page = req.query.page;
    const limit = req.query.limit;

    //input integrity check//
    if (!page.match(/^\d+$/)) {
        res.status(422).json({ message: 'Page parameter must be a number.' });
    } else if (!limit.match(/^\d+$/)) {
        res.status(422).json({ message: 'Limit parameter must be a number.' });
    } else {
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const results = {};
        const report = [];

        let [doctors, _] = await Employee.getDoctors();
        for(const doctor of doctors) {
            let [treatments, _] = await Treatment.getTreatmentsOfDoctor(doctor.idemployee);
            report.push({id:doctor.idemployee,name:doctor.name,treatments});
        }

        results.message = 'Get Doctors Report Successfully';

        if (doctors.length > 0) {
            if (endIndex < doctors.length) {
                results.next = {
                    page: parseInt(page) + 1,
                    limit: parseInt(limit)
                }
            }

            if (startIndex > 0) {
                results.previous = {
                    page: parseInt(page) - 1,
                    limit: parseInt(limit)
                }
            }

            results.report = report.slice(startIndex, endIndex);
            res.status(200).json(results);
        }
        else
            res.status(200).json({ message: `There are no doctors as employees` });
    }
}

exports.updateEmployee = async (req, res, next) => {
    try {
        const { idemployee, name, role } = req.body;

        //input integrity check//
        const roleValidation = ['General manager', 'Doctor', 'Assistant'];
        if (typeof idemployee !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else if (!name.match(/^[A-Za-z\s]*$/)) {
            res.status(422).json({ message: 'Name is not valid.' });
        } else if (!roleValidation.includes(role)) {
            res.status(422).json({ message: 'The role is not valid.' });
        } else {
            let employee = new Employee(name, role);

            employee = await employee.updateEmployee(parseInt(idemployee));

            res.status(201).json({ message: 'Update Employee Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.deleteEmployee = async (req, res, next) => {
    try {
        const { idemployee } = req.body;

        //input integrity check//
        if (typeof idemployee !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            let employee = new Employee();

            employee = await employee.deleteEmployee(idemployee);

            res.status(200).json({ message: 'Delete Employee Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
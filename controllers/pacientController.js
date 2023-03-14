const Pacient = require('../models/Pacient');

exports.createPacient = async (req, res, next) => {
    try {
        const { name, age, illness } = req.body;

        //input integrity check//
        if (!name.match(/^[A-Za-z\s]*$/)) {
            res.status(422).json({ message: 'Name is not valid.' });
        } else if (typeof age !== 'number') {
            res.status(422).json({ message: 'Age must be a number.' });
        } else if (typeof illness !== 'string') {
            res.status(422).json({ message: 'Illness must be a string.' });
        } else {
            let pacient = new Pacient(name, age, illness);

            pacient = await pacient.createPacient();

            res.status(201).json({ message: 'Create Pacient Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getPacientInfo = async (req, res, next) => {
    try {
        const idpacient = req.params.id;

        //input integrity check//
        if (!idpacient.match(/^\d+$/)) {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            let [result, _] = await Pacient.getPacientInfo(parseInt(idpacient));

            if (result.length > 0)
                res.status(200).json({ message: 'Get Pacient Info Successfully', pacient: result[0] });
            else
                res.status(200).json({ message: `There is no Pacient with id: ${idpacient}` });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.getPacientReport = async (req, res, next) => {
    try {
        const { idpacient } = req.body;
        const page = req.query.page;
        const limit = req.query.limit;

        //input integrity check//
        if (typeof idpacient !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else if (!page.match(/^\d+$/)) {
            res.status(422).json({ message: 'Page parameter must be a number.' });
        } else if (!limit.match(/^\d+$/)) {
            res.status(422).json({ message: 'Limit parameter must be a number.' });
        } else {
            const startIndex = (parseInt(page) - 1) * parseInt(limit);
            const endIndex = startIndex + parseInt(limit);
            const results = {};


            let [report, _] = await Pacient.getPacientReport(idpacient);
            results.message = 'Get Pacient Report Successfully';

            if (report.length > 0) {
                if (endIndex < report.length) {
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
                res.status(200).json({ message: `There are no treatments for pacient with id: ${idpacient}` });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.updatePacient = async (req, res, next) => {
    try {
        const { idpacient, name, age, illness } = req.body;

        //input integrity check//
        if (typeof idpacient !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else if (!name.match(/^[A-Za-z\s]*$/)) {
            res.status(422).json({ message: 'Name is not valid.' });
        } else if (typeof age !== 'number') {
            res.status(422).json({ message: 'Age must be a number.' });
        } else if (typeof illness !== 'string') {
            res.status(422).json({ message: 'Illness must be a string.' });
        } else {
            let pacient = new Pacient(name, age, illness);

            pacient = await pacient.updatePacient(parseInt(idpacient));

            res.status(201).json({ message: 'Update Pacient Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.deletePacient = async (req, res, next) => {
    try {
        const { idpacient } = req.body;

        //input integrity check//
        if (typeof idpacient !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            let pacient = new Pacient();

            pacient = await pacient.deletePacient(parseInt(idpacient));
    
            res.status(200).json({ message: 'Delete Pacient Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.assignAssistant = async (req, res, next) => {
    try {
        const { idpacient, idemployee } = req.body;

        //input integrity check//
        if (typeof idpacient !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            //verifica daca idemployee e asistent !!!
            let pacient = new Pacient();

            pacient = await pacient.assignAssistant(idpacient, idemployee);

            res.status(201).json({ message: 'Assistant Assigned Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
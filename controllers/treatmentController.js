const Treatment = require('../models/Treatment');

exports.createTreatment = async (req, res, next) => {
    try {
        const { description , date , doctor , pacient } = req.body;

        //input integrity check//
        if (typeof doctor !== 'number' || typeof pacient !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else if( typeof description !== 'string'){
            res.status(422).json({ message: 'Description must be a string.' });
        } else {
            let treatment = new Treatment(description , date , doctor , pacient);

            treatment = await treatment.createTreatment();
    
            res.status(201).json({ message: 'Create Treatment Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        if (error.code == 'ER_NO_REFERENCED_ROW_2') {
            let errorAt = error.sqlMessage.split(' ')[error.sqlMessage.split(' ').length - 1];
            errorAt = errorAt === '(`idemployee`))' ? 'doctor' : 'pacient';
            res.status(422).json({ message: `There is no ${errorAt} with that Id.` });
        } else {
            next(error);
        }
    }
}

exports.getTreatmentInfo = async (req, res, next) => {
    try {
        const idtreatment = req.params.id;

        //input integrity check//
        if (!idtreatment.match(/^\d+$/)) {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            let [result, _] = await Treatment.getTreatmentInfo(parseInt(idtreatment));
            if (result.length > 0)
                res.status(200).json({ message: 'Get Treatment Info Successfully', treatment: result[0] });
            else
                res.status(200).json({ message: `There is no Treatment with id: ${idtreatment}` });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.updateTreatment = async (req, res, next) => {
    try {
        const { idtreatment, description , date , doctor , pacient } = req.body;

        //input integrity check//
        if (typeof idtreatment !== 'number' || typeof doctor !== 'number' || typeof pacient !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else if( typeof description !== 'string'){
            res.status(422).json({ message: 'Description must be a string.' });
        } else {
            let treatment = new Treatment(description , date , doctor , pacient);

            treatment = await treatment.updateTreatment(parseInt(idtreatment));
    
            res.status(201).json({ message: 'Update Treatment Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        if (error.code == 'ER_NO_REFERENCED_ROW_2') {
            let errorAt = error.sqlMessage.split(' ')[error.sqlMessage.split(' ').length - 1];
            errorAt = errorAt === '(`idemployee`))' ? 'doctor' : 'pacient';
            res.status(422).json({ message: `There is no ${errorAt} with that Id.` });
        } else {
            next(error);
        }
    }
}

exports.deleteTreatment = async (req, res, next) => {
    try {
        const { idtreatment } = req.body;

        //input integrity check//
        if (typeof idtreatment !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
            let treatment = new Treatment();

            treatment = await treatment.deleteTreatment(parseInt(idtreatment));
    
            res.status(200).json({ message: 'Delete Treatment Info Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}

exports.appliedTreatment = async (req, res, next) => {
    try {
        const { idtreatment, idemployee } = req.body;

        //input integrity check//
        if (typeof idtreatment !== 'number') {
            res.status(422).json({ message: 'Id must be a number.' });
        } else {
                //verifica daca idemployee e asistent !!!
            let treatment = new Treatment();

            treatment = await treatment.applied(parseInt(idtreatment), parseInt(idemployee));

            res.status(201).json({ message: 'Assistant Applied Treatment Successfully' });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
}
const express = require('express');
const pacientControllers = require('../controllers/pacientController');
const { decodeToken,authorizeCheck,verifyIfIdIsAssistant } = require('../models/Middleware');
const router = express.Router();


//Pacient management (done by Doctor or General manager)
router.route('/id=:id').get(decodeToken,authorizeCheck(['General manager','Doctor']),pacientControllers.getPacientInfo);    //[DONE]
router.route('/create').post(decodeToken,authorizeCheck(['General manager','Doctor']),pacientControllers.createPacient);    //[DONE]
router.route('/update').put(decodeToken,authorizeCheck(['General manager','Doctor']),pacientControllers.updatePacient);     //[DONE]
router.route('/delete').delete(decodeToken,authorizeCheck(['General manager','Doctor']),pacientControllers.deletePacient);  //[DONE]

//Pacient assignment to a Assistant (done by Doctor or General manager)
router.route('/assign-assistant').put(decodeToken,authorizeCheck(['General manager','Doctor']),verifyIfIdIsAssistant,pacientControllers.assignAssistant);  //[DONE]

//A report with all the treatments applied to a Pacient
router.route('/report').get(decodeToken,authorizeCheck(['General manager','Doctor']),pacientControllers.getPacientReport);   //[DONE]

module.exports = router;
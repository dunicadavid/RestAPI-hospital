const express = require('express');
const treatmentControllers = require('../controllers/treatmentController');
const { decodeToken, authorizeCheck,verifyIfIdIsAssistant } = require('../models/Middleware');
const router = express.Router();


//Treatment management (done by Doctor or General manager)
router.route('/id=:id').get(decodeToken,authorizeCheck(['General manager','Doctor']),treatmentControllers.getTreatmentInfo);     //[DONE]
router.route('/create').post(decodeToken,authorizeCheck(['Doctor']),treatmentControllers.createTreatment);                       //[DONE]
router.route('/update').put(decodeToken,authorizeCheck(['General manager','Doctor']),treatmentControllers.updateTreatment);      //[DONE]
router.route('/delete').delete(decodeToken,authorizeCheck(['General manager','Doctor']),treatmentControllers.deleteTreatment);   //[DONE]


//Treatment applied by an Assistant (Assistant only)
router.route('/applied').put(decodeToken,authorizeCheck(['Assistant']),verifyIfIdIsAssistant,treatmentControllers.appliedTreatment);        //[DONE]


module.exports = router;
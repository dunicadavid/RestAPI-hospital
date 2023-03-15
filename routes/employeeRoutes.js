const express = require('express');
const employeeControllers = require('../controllers/employeeController');
const { decodeToken,authorizeCheck } = require('../models/Middleware');
const router = express.Router();

//Doctor&Assistant Management (done by the General manager)
router.route('/id=:id').get(decodeToken,authorizeCheck(['General manager']),employeeControllers.getEmployeeInfo);       //[DONE]
router.route('/update').put(decodeToken,authorizeCheck(['General manager']),employeeControllers.updateEmployee);        //[DONE]
router.route('/delete').delete(decodeToken,authorizeCheck(['General manager']),employeeControllers.deleteEmployee);     //[DONE]

//Login & register
router.route('/register').post(employeeControllers.registerEmployee);                                                   //[DONE]
router.route('/login').get(employeeControllers.login);                                                                  //[DONE]


//A report containing the list of all the Doctors and the associated patients and a section for statistics data
router.route('/report').get(decodeToken,authorizeCheck(['General manager']),employeeControllers.getEmployeeReport);     //[DONE]

module.exports = router;
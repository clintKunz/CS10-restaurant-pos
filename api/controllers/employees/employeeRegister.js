const jwt = require('jsonwebtoken');

const keys = require('../../../config/keys');
// verifyFields verifies that all required fields are provided
const verifyFields = require('../../validation/verifyFields');
const Employee = require('../../models/Employee');
// Verify Roles for Authentication
const verifyRole = require('../../validation/verifyRole');

// @route   POST api/employees/add
// @desc    Adds a new user to the DB
// @access  Public
const employeeRegister = (req, res) => {
  const {
    pass: password, role, name, images,
  } = req.body;

  // Validate Fields
  const missingFields = verifyFields(['pass', 'name'], req.body, res);

  if (missingFields.length > 0) {
    return res.status(422).json({ msg: `Fields missing: ${missingFields.join(', ')}` });
  }

  let restaurant;
  let themeColor;

  try {
    // Check to see if token exists
    if (!req.headers.authorization) {
      return res.status(401).json({ msg: 'You are not authorized to do this.' });
    }
    const currentUser = jwt.verify(req.headers.authorization.slice(7), keys.secretOrKey);

    /* eslint-disable prefer-destructuring */
    restaurant = currentUser.restaurant;
    themeColor = currentUser.themeColor;
    /* eslint-enable prefer-destructuring */

    // Verify roles
    if (!verifyRole(currentUser)) {
      return res.status(401).json({ msg: 'You are not authorized to do this.' });
    }
  } catch (err) {
    return res.status(500).json({ err, msg: 'Error verifying the token.' });
  }

  // TODO: Check if pin exists before saving
  let pin = '';

  for (let i = 0; i < 4; i++) {
    pin += Math.floor(Math.random() * 10);
  }

  // Create a new employee
  const newEmployee = new Employee({
    name,
    password,
    images,
    role,
    pin,
    restaurant,
    themeColor
  });

  newEmployee
    .save()
    .then((employeeInfo) => {
      // Send the employees pin number
      res.status(201).json({ pin: employeeInfo.pin });
    })
    .catch((err) => {
      res.status(500).json({ err, msg: 'Error saving the employee to the database.' });
    });
};

module.exports = { employeeRegister };

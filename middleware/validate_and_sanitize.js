const { body, oneOf } = require('express-validator');
const { validationResult } = require('express-validator');

const validateInput = (method) => {
  switch (method) {
    case 'createUser': {
      return [
      body('firstName')
        .exists()
        .withMessage('First Name is required')
        .isLength({ min: 2 })
        .withMessage('First Name should be at least 2 characters')
        .isString()
        .withMessage('First Name should be a String')
        .trim()
        .escape(),

      body('lastName')
        .exists()
        .withMessage('Last Name is required')
        .isLength({ min: 2 })
        .withMessage('Last Name should be at least 2 characters')
        .isString()
        .withMessage('Last Name should be a String')
        .trim()
        .escape(),

      body('email', 'Invalid email')
        .exists()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail(),

      body('password')
        .exists()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password should be at least 6 characters')
        .escape(),

      body('gender')
        .exists()
        .withMessage('Gender is required')
        .isLength({ min: 4 })
        .withMessage('Gender should be at least 4 characters')
        .isString()
        .withMessage('Gender should be a String')
        .trim()
        .escape(),

      body('jobRole')
        .exists()
        .withMessage('Job Role is required')
        .isLength({ min: 2 })
        .withMessage('Job Role should be at least 2 characters')
        .isString()
        .withMessage('Job Role should be a String')
        .trim()
        .escape(),

      body('department')
        .exists()
        .withMessage('Department is required')
        .isLength({ min: 2 })
        .withMessage('Department should be at least 2 characters')
        .isString()
        .withMessage('Department should be a String')
        .trim()
        .escape(),

      body('address')
        .exists()
        .withMessage('Address is required')
        .isLength({ min: 2 })
        .withMessage('Address should be at least 2 characters')
        .isString()
        .withMessage('Address should be a String')
        .trim()
        .escape(),

      body().custom(body => {
          const keys = ['firstName', 'lastName', 'email', 'password',
            'gender', 'jobRole', 'department', 'address',];
          return Object.keys(body).every(key => keys.includes(key));
        }).withMessage('Malformed request'),
    ];
    }
  }
};

// const handleValidationErrors = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     let error = errors.array();
//     let errMsg = [];
//     error.forEach(err => errMsg.push(err.msg));
//     return res.status(422).json({ errors: errMsg });
//   }
//
//   // next();
// };

module.exports = {
  validatedInput: validateInput,
  // handledValidationErrors: handleValidationErrors,
};

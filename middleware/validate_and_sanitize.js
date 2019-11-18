const { body } = require('express-validator');

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
            'gender', 'jobRole', 'department', 'address',
          ];
          return Object.keys(body).every(key => keys.includes(key));
        }).withMessage('Malformed request'),
    ];
    }

    case 'loginUser': {
      return [
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
      ];
    }

    case 'gifAdd': {
      return [
        body('title')
        .exists()
        .withMessage('title is required')
        .trim()
        .escape(),
      ];
    }

    case 'articleAdd': {
      return [
        body('title')
        .exists()
        .withMessage('title is required')
        .isLength({ min: 1 })
        .withMessage('article title should be at least 1 character')
        .trim()
        .escape(),

      body('article')
        .exists()
        .withMessage('article content is required')
        .isLength({ min: 1 })
        .withMessage('article should be at least 1 character')
        .trim()
        .escape(),
      ];
    }

    case 'articleComment': {
      return [
        body('comment')
        .exists()
        .withMessage('Comment is required')
        .isLength({ min: 1 })
        .withMessage('Comment should be at least 1 character')
        .trim()
        .escape(),
      ];
    }

    case 'gifComment': {
      return [
        body('comment')
        .exists()
        .withMessage('Comment is required')
        .isLength({ min: 1 })
        .withMessage('Comment should be at least 1 character')
        .trim()
        .escape(),
      ];
    }
  }
};

module.exports = {
  validatedInput: validateInput,
};

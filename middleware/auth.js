const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const JWT_SECRET_TOKEN = process.env.JWT_TOKEN_SECRET;

exports.userAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);
    const userId = decodeToken.userId;
    if (req.body.userId && req.body.userId !== userId)
      return res.status(401).json({
          status: 'error',
          error: 'Invalid user ID',
        });
    else
      next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      error: 'Invalid request, try logging in',
    });
  }
};

exports.adminAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);
    const userId = decodeToken.userId;
    const isAdmin = decodeToken.isAdmin;

    if (!isAdmin)
      return res.status(401).json({
        status: 'error',
        error: 'Unauthorized User',
      });
    else
      next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      error: 'Invalid request',
    });
  }
};

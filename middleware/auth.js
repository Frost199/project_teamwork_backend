const jwt = require('jsonwebtoken');
const JWT_SECRET_TOKEN = 'a2f5c815c03053b089ace56bc6b4e57704d23ebff7e0aa' +
  '837995fc8f531be1835f76cc1087c922a4c9d197b4d4cafc6c';

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodeToken = jwt.verify(token, JWT_SECRET_TOKEN);
    const userId = decodeToken.userId;
    if (req.body.userId && req.body.userId !== userId)
      return 'Invalid user ID';
    else
      next();
  } catch (err) {
    res.status(401).json({
      error: new Error('Invalid request'),
    });
  }
};

const jwt = require('jsonwebtoken');

const authMiddleware = function ({ req }) {
   let token = req.query.token || req.headers.authorization || req.body.token;

   if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
   }

   if (!token) {
      return req;
   }

   try {
      const { data } = jwt.verify(token, process.env.JWT_SECRET_KEY, { maxAge: '3h' });
      req.user = data;
   } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'invalid token!' });
   }

   return req;
};

const signToken = function ({ username, email, _id }) {
   const payload = { username, email, _id };

   return jwt.sign({ data: payload }, process.env.JWT_SECRET_KEY, { expiresIn: '3h' });
};

module.exports = { authMiddleware, signToken };

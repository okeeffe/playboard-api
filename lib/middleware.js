import basicAuth from 'basic-auth';

import User, { allUserPropsForAuth } from './models/user';

// MIDDLEWARE

// Standardised return for bad credentials
const unauthorized = (res) => {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.status(403)
            .json({ code: 403, message: 'You don\'t have authorization!' });
};

// Basic auth checking
const auth = (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name) {
    return unauthorized(res);
  }

  // Check the API key coming in (we don't use the password field)
  const apiKey = credentials.name;
  User.findOne({ apiKey }, allUserPropsForAuth, (findErr, user) => {
    if (findErr || !user) {
      return unauthorized(res);
    }

    req.user = user; // eslint-disable-line no-param-reassign
    next();
  });
};

// Check if a user is super (though aren't all users super, deep down?)
const superuser = (req, res, next) => {
  if (!req.user || !req.user.super) {
    return unauthorized(res);
  }

  return next();
};

const middleware = {};
middleware.unauthorized = unauthorized;
middleware.auth = auth;
middleware.superuser = superuser;

export { middleware, unauthorized, auth, superuser };
export default middleware;

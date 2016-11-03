import basicAuth from 'basic-auth';

import User, { allSensitiveUserPropsMongoStr } from './models/user';

// MIDDLEWARE

/**
 * Standardised return for bad credentials
 * @param {Object} res - the Express response object
 * @returns {Object} res
 */
const unauthorized = (res) => {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
  return res.status(403)
            .json({ code: 403, message: 'You don\'t have authorization!' });
};


/**
 * Basic Auth verification for API keys
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @param {Object} next - the Express middleware callback
 * @returns {Object} call to unauthorized
 */
const auth = (req, res, next) => {
  const credentials = basicAuth(req);

  if (!credentials || !credentials.name) {
    return unauthorized(res);
  }

  // Check the API key coming in (we don't use the password field)
  const apiKey = credentials.name;
  // TODO: User.findOne should populate a redis table or similar and check that first
  User.findOne({ apiKey }, allSensitiveUserPropsMongoStr, (findErr, user) => {
    if (findErr || !user) {
      return unauthorized(res);
    }

    req.user = user; // eslint-disable-line no-param-reassign
    next();
  });
};

/**
 * Check if a user is super (though aren't all users super, deep down?)
 * @param {Object} req - the Express request object
 * @param {Object} res - the Express response object
 * @param {Object} next - the Express middleware callback
 * @returns {Object} call to unauthorized
 */
const superuser = (req, res, next) => {
  if (!req.user || !req.user.super) {
    return unauthorized(res);
  }

  next();
};

const middleware = {};
middleware.unauthorized = unauthorized;
middleware.auth = auth;
middleware.superuser = superuser;

export { middleware, unauthorized, auth, superuser };
export default middleware;

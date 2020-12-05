import { AUTHORIZER_TYPE, AUTHORIZER_401 } from '../constants';
import { getPolicy } from '../utils';

export const basicAuthorizer = async (event, _context, callback) => {
  try {
    const { type, authorizationToken, methodArn } = event;
    if (type !== AUTHORIZER_TYPE) {
      callback(AUTHORIZER_401);
      return;
    }

    const policy = getPolicy(authorizationToken, methodArn);
    callback(null, policy);
  } catch (e) {
    callback(AUTHORIZER_401);
  }
};

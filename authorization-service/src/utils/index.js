import { ALLOW, DENY } from '../constants';

export const generatePolicy = (principalId, resource, effect = DENY) => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    },
  },
});

export const validateUser = (username, password) => {
  const validPassword = process.env[username];
  return validPassword && validPassword === password;
};

export const getPolicy = (authorizationToken, methodArn) => {
  const encodedCreds = authorizationToken.split(' ')[1];
  const [username, password] = Buffer.from(encodedCreds, 'base64')
    .toString('utf-8')
    .split(':');
  const effect = validateUser(username, password) ? ALLOW : DENY;
  return generatePolicy(encodedCreds, methodArn, effect);
};

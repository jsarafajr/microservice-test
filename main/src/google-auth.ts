const GoogleAuth = require('google-auth-library');

const { CLIENT_SECRET, CLIENT_ID, REDIRECT_URI } = process.env;
const OAUTH_SCOPE = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

const auth = new GoogleAuth();
const oAuthClient = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export function getAuthUrl() {
  return oAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: OAUTH_SCOPE
  });
}

export function getCredentials(code) {
  return new Promise((resolve, reject) => {
    oAuthClient.getToken(code, (err, tokens) => {
      if (err) reject(err);
      else resolve(tokens);
    });
  });
}

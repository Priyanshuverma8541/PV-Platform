const oauthConfig = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID as string,
    clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    redirectUri: process.env.GITHUB_REDIRECT_URI ?? 'http://localhost:4000/api/oauth/github/callback',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: process.env.GOOGLE_REDIRECT_URI ?? 'http://localhost:4000/api/oauth/google/callback',
  },
};

export default oauthConfig;

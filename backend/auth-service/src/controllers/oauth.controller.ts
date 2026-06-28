import { Request, Response } from 'express';
import oauthConfig from '../config/oauth.js';

export function githubAuth(req: Request, res: Response) {
  const redirectUrl = new URL('https://github.com/login/oauth/authorize');
  redirectUrl.searchParams.set('client_id', oauthConfig.github.clientId);
  redirectUrl.searchParams.set('redirect_uri', oauthConfig.github.redirectUri);
  redirectUrl.searchParams.set('scope', 'read:user user:email');

  res.redirect(redirectUrl.toString());
}

export function googleAuth(req: Request, res: Response) {
  const redirectUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  redirectUrl.searchParams.set('client_id', oauthConfig.google.clientId);
  redirectUrl.searchParams.set('redirect_uri', oauthConfig.google.redirectUri);
  redirectUrl.searchParams.set('response_type', 'code');
  redirectUrl.searchParams.set('scope', 'openid email profile');
  redirectUrl.searchParams.set('access_type', 'offline');

  res.redirect(redirectUrl.toString());
}

export function oauthCallback(req: Request, res: Response) {
  const { code, state } = req.query;
  res.json({ message: 'OAuth callback received', code, state });
}

import axios from 'axios';
import { config } from '../config/config.js';

export class OAuthService {
  static async exchangeCodeForToken(code, redirectUri) {
    try {
      const response = await axios.post(config.google.tokenEndpoint, {
        code,
        client_id: config.google.clientId,
        client_secret: config.google.clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      });

      return response.data.access_token;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw new Error('Failed to exchange authorization code');
    }
  }

  static async getUserInfo(accessToken) {
    try {
      const response = await axios.get(config.google.userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        picture: response.data.picture,
        verified_email: response.data.verified_email,
      };
    } catch (error) {
      console.error('Error fetching user info:', error.response?.data || error.message);
      throw new Error('Failed to fetch user information');
    }
  }

  static async authenticateWithGoogle(code, redirectUri) {
    // Exchange code for access token
    const accessToken = await this.exchangeCodeForToken(code, redirectUri);

    // Get user info
    const userInfo = await this.getUserInfo(accessToken);

    if (!userInfo.verified_email) {
      throw new Error('Email not verified');
    }

    return {
      provider: 'google',
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      picture: userInfo.picture,
    };
  }
}

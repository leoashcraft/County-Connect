import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import { UserModel } from '../models/User.js';
import { OAuthService } from '../services/oauthService.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/auth/callback - Handle OAuth callback
router.post('/callback', async (req, res) => {
  try {
    const { code, provider, redirectUri } = req.body;

    if (!code || !provider || !redirectUri) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    let oauthData;

    // Handle different OAuth providers
    if (provider === 'google') {
      oauthData = await OAuthService.authenticateWithGoogle(code, redirectUri);
    } else {
      return res.status(400).json({ message: 'Unsupported OAuth provider' });
    }

    // Find or create user
    const user = await UserModel.findOrCreate(oauthData);

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Return token and user data
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        picture: user.picture,
        role: user.role,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ message: error.message || 'Authentication failed' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      picture: user.picture,
      role: user.role,
      phone: user.phone,
      preferred_town_id: user.preferred_town_id,
      street_address: user.street_address,
      city: user.city,
      state: user.state,
      zip_code: user.zip_code,
      bio: user.bio,
      profile_completed: user.profile_completed,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

// PUT /api/auth/me - Update current user
router.put('/me', authenticateToken, async (req, res) => {
  try {
    const {
      full_name,
      picture,
      phone,
      preferred_town_id,
      street_address,
      city,
      state,
      zip_code,
      bio,
      profile_completed
    } = req.body;

    const updatedUser = await UserModel.update(req.user.id, {
      full_name,
      picture,
      phone,
      preferred_town_id,
      street_address,
      city,
      state,
      zip_code,
      bio,
      profile_completed,
    });

    res.json({
      id: updatedUser.id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      picture: updatedUser.picture,
      role: updatedUser.role,
      phone: updatedUser.phone,
      preferred_town_id: updatedUser.preferred_town_id,
      street_address: updatedUser.street_address,
      city: updatedUser.city,
      state: updatedUser.state,
      zip_code: updatedUser.zip_code,
      bio: updatedUser.bio,
      profile_completed: updatedUser.profile_completed,
      created_at: updatedUser.created_at,
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// GET /api/auth/users - List all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await UserModel.findById(req.user.id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await UserModel.list();
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// PUT /api/auth/users/:id - Update a user by ID (admin only)
router.put('/users/:id', authenticateToken, async (req, res) => {
  try {
    // Check if user is admin
    const currentUser = await UserModel.findById(req.user.id);
    if (currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Whitelist allowed fields to prevent mass assignment attacks
    const allowedFields = [
      'full_name',
      'role',
      'is_verified_vendor',
      'verification_requested',
      'phone',
      'preferred_town_id',
      'street_address',
      'city',
      'state',
      'zip_code',
      'bio',
      'profile_completed'
    ];

    const safeData = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        safeData[field] = req.body[field];
      }
    }

    const updatedUser = await UserModel.update(req.params.id, safeData);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

export default router;

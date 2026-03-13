import { Request, Response } from 'express';
import { User } from '../models';
import { ApiResponse, AuthPayload, LoginDto, CreateUserDto } from '../types';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, username, password }: CreateUserDto = req.body;

    // Validation de base
    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, username and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    const existingUsername = await User.findOne({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        error: 'Username already taken'
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // Préparer le payload pour le token
    const { password: _, ...userWithoutPassword } = user.toJSON();
    const payload: Omit<AuthPayload, 'token'> = {
      user: userWithoutPassword
    };

    // Générer le token
    const token = generateToken(payload);

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
};

export const login = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, password }: LoginDto = req.body;

    // Validation de base
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Trouver l'utilisateur
    const user = await User.findOne({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Préparer le payload pour le token
    const { password: _, ...userWithoutPassword } = user.toJSON();
    const payload: Omit<AuthPayload, 'token'> = {
      user: userWithoutPassword
    };

    // Générer le token
    const token = generateToken(payload);

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
};

export const getProfile = async (req: Request, res: Response<ApiResponse>) => {
  try {
    // L'utilisateur est déjà disponible dans req.user grâce au middleware
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile'
    });
  }
};

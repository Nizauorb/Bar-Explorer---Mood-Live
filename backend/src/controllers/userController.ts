import { Request, Response } from 'express';
import { User, Favorite, Vote, Bar } from '../models';
import { ApiResponse } from '../types';
import bcrypt from 'bcryptjs';

export const getAllUsers = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Favorite,
          as: 'favorites',
          include: [{ model: Bar, as: 'bar' }]
        },
        {
          model: Vote,
          as: 'votes',
          include: [{ model: Bar, as: 'bar' }]
        }
      ]
    });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
};

export const getUserById = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Favorite,
          as: 'favorites',
          include: [{ model: Bar, as: 'bar' }]
        },
        {
          model: Vote,
          as: 'votes',
          include: [{ model: Bar, as: 'bar' }]
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user'
    });
  }
};

export const createUser = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { email, username, password, avatar_url } = req.body;

    // Check if user already exists
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      username,
      password: hashedPassword,
      avatar_url
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.status(201).json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user'
    });
  }
};

export const updateUser = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { username, avatar_url } = req.body;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if username is taken by another user
    if (username && username !== user.username) {
      const existingUsername = await User.findOne({
        where: { username }
      });

      if (existingUsername) {
        return res.status(400).json({
          success: false,
          error: 'Username already taken'
        });
      }
    }

    await user.update({
      username,
      avatar_url
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update user'
    });
  }
};

export const deleteUser = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    await user.destroy();

    res.json({
      success: true,
      data: { message: 'User deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete user'
    });
  }
};

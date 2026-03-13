import { Request, Response } from 'express';
import { Bar, Vote } from '../models';
import { ApiResponse } from '../types';

export const getAllBars = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const bars = await Bar.findAll({
      include: [{
        model: Vote,
        as: 'votes',
        attributes: ['ambiance_score', 'affluence_level', 'created_at']
      }]
    });

    res.json({
      success: true,
      data: bars
    });
  } catch (error) {
    console.error('Error fetching bars:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bars'
    });
  }
};

export const getBarById = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    
    const bar = await Bar.findByPk(id, {
      include: [{
        model: Vote,
        as: 'votes',
        attributes: ['ambiance_score', 'affluence_level', 'created_at']
      }]
    });

    if (!bar) {
      return res.status(404).json({
        success: false,
        error: 'Bar not found'
      });
    }

    res.json({
      success: true,
      data: bar
    });
  } catch (error) {
    console.error('Error fetching bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bar'
    });
  }
};

export const createBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { name, address, latitude, longitude, description, phone, website } = req.body;

    const bar = await Bar.create({
      name,
      address,
      latitude,
      longitude,
      description,
      phone,
      website
    });

    res.status(201).json({
      success: true,
      data: bar
    });
  } catch (error) {
    console.error('Error creating bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bar'
    });
  }
};

export const updateBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;
    const { name, address, latitude, longitude, description, phone, website } = req.body;

    const bar = await Bar.findByPk(id);
    
    if (!bar) {
      return res.status(404).json({
        success: false,
        error: 'Bar not found'
      });
    }

    await bar.update({
      name,
      address,
      latitude,
      longitude,
      description,
      phone,
      website
    });

    res.json({
      success: true,
      data: bar
    });
  } catch (error) {
    console.error('Error updating bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update bar'
    });
  }
};

export const deleteBar = async (req: Request, res: Response<ApiResponse>) => {
  try {
    const { id } = req.params;

    const bar = await Bar.findByPk(id);
    
    if (!bar) {
      return res.status(404).json({
        success: false,
        error: 'Bar not found'
      });
    }

    await bar.destroy();

    res.json({
      success: true,
      data: { message: 'Bar deleted successfully' }
    });
  } catch (error) {
    console.error('Error deleting bar:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bar'
    });
  }
};

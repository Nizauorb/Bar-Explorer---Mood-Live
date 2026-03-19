import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/sequelize/User';
import { JWTService } from '../services/jwt.service';

const router = Router();

// POST /api/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, pseudo, password } = req.body;
    
    
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      email,
      pseudo,
      password_hash,
      email_verified: false,
      is_active: true
    });

    
    const token = JWTService.generateToken(user);

    console.log(`✅ Utilisateur créé: ${user.email}`);

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
        email_verified: user.email_verified,
        is_active: user.is_active,
        created_at: user.created_at,
        preferences: { musicGenres: [], goOutFrequency: '' },
        favoriteBarIds: [],
        friends: []
      },
      token
    });

  } catch (error: any) {
    console.error('❌ Erreur inscription:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription',
      details: error.message
    });
  }
});

// POST /api/login 
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    if (!user.password_hash) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    
    const token = JWTService.generateToken(user);
    user.last_login = new Date();
    await user.save();

    console.log(`✅ Connexion: ${user.email}`);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        pseudo: user.pseudo,
        email_verified: user.email_verified,
        is_active: user.is_active,
        created_at: user.created_at,
        last_login: user.last_login,
        preferences: { musicGenres: [], goOutFrequency: '' },
        favoriteBarIds: [],
        friends: []
      },
      token
    });

  } catch (error: any) {
    console.error('❌ Erreur connexion:', error);
    res.status(500).json({
      error: 'Erreur lors de la connexion',
      details: error.message
    });
  }
});

export default router;
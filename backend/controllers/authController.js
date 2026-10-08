import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { Task } from '../models/Task.js';

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'taskflow_super_secret_jwt_key_2026_xyz987';
  return jwt.sign({ id }, secret, { expiresIn: '30d' });
};

// Seed realistic tasks for demo user
const seedDemoTasks = async (userId) => {
  const today = new Date();
  const formatOffset = (offsetDays, timeStr = '17:00') => {
    const d = new Date(today);
    d.setDate(d.getDate() + offsetDays);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}T${timeStr}`;
  };

  const sampleTasks = [
    {
      user: userId,
      title: 'Submit Q3 Product Roadmap & Strategy Deck',
      description: 'Finalize executive slides with target metrics, release timelines, and resource allocation.',
      priority: 'high',
      dueDate: formatOffset(0, '15:30'), // Due today
      category: 'Work',
      completed: false,
    },
    {
      user: userId,
      title: 'Review pull request for auth token expiration bug',
      description: 'Check security regressions and verify OAuth2 refresh cycle edge cases.',
      priority: 'high',
      dueDate: formatOffset(1, '12:00'), // Due tomorrow
      category: 'Work',
      completed: false,
    },
    {
      user: userId,
      title: 'Pay quarterly cloud infrastructure invoice',
      description: 'Review AWS & MongoDB Atlas usage breakdown before authorizing payment.',
      priority: 'medium',
      dueDate: formatOffset(-1, '09:00'), // Overdue
      category: 'Finance',
      completed: false,
    },
    {
      user: userId,
      title: 'Annual health checkup appointment',
      description: 'Bring recent lab results and health insurance card to Dr. Vance clinic.',
      priority: 'medium',
      dueDate: formatOffset(3, '10:15'),
      category: 'Health',
      completed: false,
    },
    {
      user: userId,
      title: 'Study React 19 Actions and Node Express Microservices',
      description: 'Review documentation, code sample migration guides, and production deployment patterns.',
      priority: 'low',
      dueDate: formatOffset(7, '20:00'),
      category: 'Study',
      completed: false,
    },
    {
      user: userId,
      title: 'Weekly grocery restock & meal prep',
      description: 'Organic greens, salmon, Greek yogurt, sparkling water, and snacks.',
      priority: 'low',
      dueDate: formatOffset(-2, '18:00'),
      category: 'Personal',
      completed: true,
      completedAt: new Date(Date.now() - 3600000 * 20),
    },
  ];

  await Task.insertMany(sampleTasks);
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.',
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No account found with this email.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.',
    });
  }
};

// @desc    Get current authenticated user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id.toString(),
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Instant Demo account access
// @route   POST /api/auth/demo
// @access  Public
export const demoLogin = async (req, res) => {
  try {
    const demoEmail = 'alex.johnson@example.com';
    let user = await User.findOne({ email: demoEmail });

    if (!user) {
      user = await User.create({
        name: 'Alex Johnson',
        email: demoEmail,
        password: 'demoPassword123!',
      });
      await seedDemoTasks(user._id);
    } else {
      // Check if user has tasks; if not, seed them
      const count = await Task.countDocuments({ user: user._id });
      if (count === 0) {
        await seedDemoTasks(user._id);
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error during demo access.',
    });
  }
};

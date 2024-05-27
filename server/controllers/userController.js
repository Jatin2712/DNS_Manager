import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { firstname, lastname, username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User Already Exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstname,
      lastname,  
      username,
      email,
      password: hashedPassword
    });
    await newUser.save();

    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'User Logged In Successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
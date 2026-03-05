import pool from '../utils/database.js';
import { hashPassword, comparePassword } from '../utils/passwordUtils.js';
import { 
  validateUniversityEmail, 
  extractUserIdFromEmail,
  extractFacultyAndBatch 
} from '../utils/userUtils.js';
import { generateToken } from '../utils/jwtUtils.js';
import admin from 'firebase-admin';

export const registerUser = async (req, res) => {
  try {
    // Accept either `email` or `university_email` from client for flexibility
    const { email, university_email, password, name } = req.body;
    const uniEmail = email || university_email;

    // Validate email format
    if (!validateUniversityEmail(uniEmail)) {
      return res.status(400).json({ message: 'Must use a valid university email (.pdn.ac.lk)' });
    }

    // Extract user ID from email
    const userId = extractUserIdFromEmail(uniEmail);

    // Check if user already exists by ID or email
    const userExists = await pool.query(
      'SELECT * FROM "user" WHERE user_id = $1 OR university_email = $2',
      [userId, uniEmail]
    );
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user with default role 'student'
    const newUser = await pool.query(
      'INSERT INTO "user" (user_id, university_email, name, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, uniEmail, name, hashedPassword, 'student']
    );

    // Generate token
    const token = generateToken(userId, 'student');

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: newUser.rows[0].user_id,
        email: newUser.rows[0].university_email,
        name: newUser.rows[0].name,
        role: newUser.rows[0].role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { userId, password } = req.body;

    // Convert userId to lowercase for case-insensitive login
    const userIdLower = userId.toLowerCase();

    // Find user by ID
    const user = await pool.query('SELECT * FROM "user" WHERE user_id = $1', [userIdLower]);
    
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await comparePassword(password, user.rows[0].password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(userIdLower, user.rows[0].role);

    res.json({
      message: 'Login successful',
      token,
      user: {
        userId: user.rows[0].user_id,
        email: user.rows[0].university_email,
        name: user.rows[0].name,
        role: user.rows[0].role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await pool.query('SELECT * FROM "user" WHERE user_id = $1', [userId]);
    
    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = user.rows[0];
    const { faculty, batch } = extractFacultyAndBatch(userId);

    res.json({
      user: {
        userId: userData.user_id,
        email: userData.university_email,
        name: userData.name,
        role: userData.role,
        profilePicture: userData.profile_picture,
        tel: userData.tel,
        personalEmail: userData.personal_email,
        district: userData.district,
        faculty,
        batch
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, profilePicture, tel, personalEmail, district } = req.body;

    const updatedUser = await pool.query(
      'UPDATE "user" SET name = $1, profile_picture = $2, tel = $3, personal_email = $4, district = $5 WHERE user_id = $6 RETURNING *',
      [name, profilePicture, tel, personalEmail, district, userId]
    );

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userData = updatedUser.rows[0];
    const { faculty, batch } = extractFacultyAndBatch(userId);

    res.json({
      message: 'Profile updated successfully',
      user: {
        userId: userData.user_id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        profilePicture: userData.profile_picture,
        tel: userData.tel,
        personalEmail: userData.personal_email,
        district: userData.district,
        faculty,
        batch
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

export const verifyFirebaseToken = async (req, res) => {
  try {
    const { firebaseToken } = req.body;
    
    if (!firebaseToken) {
      return res.status(400).json({ message: 'Firebase token is required' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const email = decodedToken.email;

    // Validate email format
    if (!validateUniversityEmail(email)) {
      return res.status(400).json({ message: 'Please use your university email (.pdn.ac.lk)' });
    }

    // Extract user ID from email
    const userId = extractUserIdFromEmail(email);

    // Check if user exists in database
    const userExists = await pool.query(
      'SELECT * FROM "user" WHERE user_id = $1',
      [userId]
    );

    if (userExists.rows.length === 0) {
      return res.status(404).json({ message: 'User not found. Please register first using traditional login.' });
    }

    const user = userExists.rows[0];

    // Generate JWT token
    const token = generateToken(userId, user.role);
    const { faculty, batch } = extractFacultyAndBatch(userId);

    res.json({
      message: 'Firebase authentication successful',
      token,
      user: {
        userId: user.user_id,
        email: user.university_email,
        name: user.name,
        role: user.role,
        profilePicture: user.profile_picture,
        tel: user.tel,
        personalEmail: user.personal_email,
        district: user.district,
        faculty,
        batch
      }
    });
  } catch (error) {
    console.error('Firebase verification error:', error);
    res.status(401).json({ message: 'Invalid Firebase token' });
  }
};

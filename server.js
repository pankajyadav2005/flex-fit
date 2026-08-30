require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');

const app = express();

app.use(express.json());               // lets us read JSON sent from the browser
app.use(express.static('public'));     // serves index.html, style.css, etc.
app.use(session({
  secret: 'flexfit-secret-key',        // used to sign the session cookie
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  let user = db.prepare('SELECT * FROM users WHERE email = ?').get(profile.emails[0].value);

  if (!user) {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    const result = stmt.run(profile.displayName, profile.emails[0].value, 'google-oauth');
    user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  }

  done(null, user);
}));

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Middleware: blocks access unless the user is logged in (works for both manual + Google login)
function requireLogin(req, res, next) {
  const userId = req.session.userId || (req.user && req.user.id);
  if (!userId) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  req.currentUserId = userId;
  next();
}

// SIGNUP route
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const strongPassword = /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  if (!strongPassword.test(password)) {
    return res.status(400).json({
      error: 'Password must be at least 8 characters and include a special symbol (e.g. ! @ # $ %)'
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const stmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
    stmt.run(name, email, hashedPassword);
    res.json({ message: 'Signup successful' });
  } catch (err) {
    res.status(400).json({ error: 'Email already in use' });
  }
});

// LOGIN route
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  req.session.userId = user.id;
  res.json({ message: 'Login successful', name: user.name });
});

// LOGOUT route
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

// GET profile - load existing data (or null if none yet)
app.get('/api/profile', requireLogin, (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.currentUserId);
  if (!profile) return res.json(null);

  res.json({
    ...profile,
    sports: JSON.parse(profile.sports || '[]'),
    goals: JSON.parse(profile.goals || '[]')
  });
});

// SAVE profile - insert or update, WITH VALIDATION
app.post('/api/profile', requireLogin, (req, res) => {
  const { sports, goals, age, height, weight, target_weight, fitness_level } = req.body;

  // Validate numeric fields before touching the database
  if (!age || isNaN(age) || age < 5 || age > 100) {
    return res.status(400).json({ error: 'Invalid age (must be 5-100)' });
  }
  if (!height || isNaN(height) || height < 50 || height > 250) {
    return res.status(400).json({ error: 'Invalid height (must be 50-250 cm)' });
  }
  if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
    return res.status(400).json({ error: 'Invalid weight (must be 20-300 kg)' });
  }
  if (!target_weight || isNaN(target_weight) || target_weight < 20 || target_weight > 300) {
    return res.status(400).json({ error: 'Invalid target weight (must be 20-300 kg)' });
  }

  const existing = db.prepare('SELECT id FROM profiles WHERE user_id = ?').get(req.currentUserId);

  if (existing) {
    db.prepare(`
      UPDATE profiles SET sports = ?, goals = ?, age = ?, height = ?, weight = ?, target_weight = ?, fitness_level = ?
      WHERE user_id = ?
    `).run(JSON.stringify(sports), JSON.stringify(goals), age, height, weight, target_weight, fitness_level, req.currentUserId);
  } else {
    db.prepare(`
      INSERT INTO profiles (user_id, sports, goals, age, height, weight, target_weight, fitness_level)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.currentUserId, JSON.stringify(sports), JSON.stringify(goals), age, height, weight, target_weight, fitness_level);
  }

  res.json({ message: 'Profile saved' });
});

// GET all weight logs for the current user, oldest first
app.get('/api/weight', requireLogin, (req, res) => {
  const logs = db.prepare('SELECT * FROM weight_logs WHERE user_id = ? ORDER BY logged_at ASC').all(req.currentUserId);
  res.json(logs);
});

// POST a new weight entry
app.post('/api/weight', requireLogin, (req, res) => {
  const { weight } = req.body;

  if (!weight || isNaN(weight) || weight < 20 || weight > 300) {
    return res.status(400).json({ error: 'Enter a valid weight (20-300 kg)' });
  }

  db.prepare('INSERT INTO weight_logs (user_id, weight) VALUES (?, ?)').run(req.currentUserId, weight);
  res.json({ message: 'Weight logged' });
});

// GET summary stats for the Progress page
app.get('/api/summary', requireLogin, (req, res) => {
  const weightCount = db.prepare('SELECT COUNT(*) as count FROM weight_logs WHERE user_id = ?').get(req.currentUserId).count;

  res.json({
    totalWorkouts: 0,      // will connect once Workout page exists
    completedWorkouts: 0,  // will connect once Workout page exists
    caloriesBurned: 0,     // will connect once Cardio page exists
    weightEntries: weightCount
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`FlexFit server running at http://localhost:${PORT}`);
});
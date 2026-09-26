require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
const FOOD_DATABASE = require('./foodDatabase');

const app = express();

app.use(express.json({ limit: '10mb' }));  // increased limit to allow base64 photo uploads
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
  callbackURL: 'https://flex-fit-1.onrender.com/auth/google/callback',
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
    res.redirect('/dashboard.html');
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

// GET cardio session history + totals
app.get('/api/cardio', requireLogin, (req, res) => {
  const sessions = db.prepare('SELECT * FROM cardio_sessions WHERE user_id = ? ORDER BY logged_at DESC').all(req.currentUserId);
  const totals = db.prepare('SELECT COALESCE(SUM(calories),0) as totalKcal, COALESCE(SUM(duration_seconds),0) as totalSeconds FROM cardio_sessions WHERE user_id = ?').get(req.currentUserId);

  res.json({
    sessions,
    totalKcal: Math.round(totals.totalKcal),
    totalMinutes: Math.round(totals.totalSeconds / 60)
  });
});

// POST a completed cardio session (now includes real GPS-tracked distance)
app.post('/api/cardio', requireLogin, (req, res) => {
  const { activity_name, met, duration_seconds, distance_km, calories } = req.body;

  if (!activity_name || !met || !duration_seconds || duration_seconds < 1) {
    return res.status(400).json({ error: 'Invalid session data' });
  }

  db.prepare(`
    INSERT INTO cardio_sessions (user_id, activity_name, met, duration_seconds, distance_km, calories)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(req.currentUserId, activity_name, met, duration_seconds, distance_km || 0, calories);

  res.json({ message: 'Session saved' });
});

// GET calorie/macro target - real TDEE formula using saved profile
app.get('/api/food/target', requireLogin, (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.currentUserId);

  if (!profile || !profile.weight || !profile.height || !profile.age) {
    return res.json({ calories: 0, protein: 0, carbs: 0, fat: 0, hasProfile: false });
  }

  // Mifflin-St Jeor formula (simplified average, since we don't collect gender)
  const bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 78;

  const activityMultiplier = {
    Beginner: 1.2,
    Intermediate: 1.375,
    Advanced: 1.55,
    Elite: 1.725
  }[profile.fitness_level] || 1.2;

  const calories = Math.round(bmr * activityMultiplier);
  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.4) / 4);
  const fat = Math.round((calories * 0.3) / 9);

  res.json({ calories, protein, carbs, fat, hasProfile: true });
});

// GET today's food log + totals
app.get('/api/food-log', requireLogin, (req, res) => {
  const logs = db.prepare(`
    SELECT * FROM food_logs
    WHERE user_id = ? AND date(logged_at) = date('now')
    ORDER BY logged_at ASC
  `).all(req.currentUserId);

  const totals = logs.reduce((acc, l) => ({
    calories: acc.calories + l.calories,
    protein: acc.protein + l.protein,
    carbs: acc.carbs + l.carbs,
    fat: acc.fat + l.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  res.json({ logs, totals });
});

// POST a logged meal (food + quantity, macros calculated from real per-100g data)
app.post('/api/food-log', requireLogin, (req, res) => {
  const { food_name, grams, calories, protein, carbs, fat } = req.body;

  if (!food_name || !grams || grams <= 0) {
    return res.status(400).json({ error: 'Invalid meal data' });
  }

  db.prepare(`
    INSERT INTO food_logs (user_id, food_name, grams, calories, protein, carbs, fat)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.currentUserId, food_name, grams, calories, protein, carbs, fat);

  res.json({ message: 'Meal logged' });
});

// POST a photo for AI food scanning via Groq's vision model (identifies items AND estimates portion size)
app.post('/api/scan-food', requireLogin, async (req, res) => {
  const { image, mimeType } = req.body; // base64-encoded image data (no data:image/... prefix)

  if (!image) {
    return res.status(400).json({ error: 'No image provided' });
  }

  const imageMime = mimeType || 'image/jpeg';
  const dataUrl = `data:${imageMime};base64,${image}`;
  const knownFoods = FOOD_DATABASE.map(f => f.name).join(', ');

  const visionPrompt = `You are a nutrition vision assistant. Look at this photo of a plate of food and identify each distinct food item visible, with a realistic estimated portion size in grams based on typical plate sizes and visual volume.

For each item, if it closely matches one of these known foods, use that EXACT name: ${knownFoods}.
If it doesn't closely match any of those, give your own best common food name and your own best estimate of calories, protein, carbs and fat per 100g for that food.

Respond with ONLY valid JSON in this exact shape, no other text, no markdown fences:
{"items": [{"food_name": "string", "estimated_grams": number, "calories_per_100g": number, "protein_per_100g": number, "carbs_per_100g": number, "fat_per_100g": number}]}`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b",
        max_tokens: 1000,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: visionPrompt },
              { type: 'image_url', image_url: { url: dataUrl } }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq vision API error:', response.status, errText);
      return res.status(502).json({ error: 'Food scan failed — please try again in a moment.' });
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '{}';

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse Groq vision JSON:', raw);
      return res.status(502).json({ error: 'Could not read the scan results — please try again.' });
    }

    const items = Array.isArray(parsed.items) ? parsed.items : [];

    const matchedFoods = items.map(item => {
      const grams = Number(item.estimated_grams) || 100;
      const rawName = String(item.food_name || '').trim();

      // Prefer an exact match against the curated database, then a loose fallback match
      const dbMatch =
        FOOD_DATABASE.find(f => f.name.toLowerCase() === rawName.toLowerCase()) ||
        FOOD_DATABASE.find(f =>
          f.name.toLowerCase().includes(rawName.toLowerCase()) ||
          rawName.toLowerCase().includes(f.name.toLowerCase().split(' ')[0])
        );

      const per100 = dbMatch
        ? { calories: dbMatch.calories, protein: dbMatch.protein, carbs: dbMatch.carbs, fat: dbMatch.fat }
        : {
            calories: Number(item.calories_per_100g) || 0,
            protein: Number(item.protein_per_100g) || 0,
            carbs: Number(item.carbs_per_100g) || 0,
            fat: Number(item.fat_per_100g) || 0
          };

      const ratio = grams / 100;

      return {
        name: dbMatch ? dbMatch.name : rawName,
        estimatedGrams: grams,
        calories: Math.round(per100.calories * ratio),
        protein: Math.round(per100.protein * ratio),
        carbs: Math.round(per100.carbs * ratio),
        fat: Math.round(per100.fat * ratio),
        source: dbMatch ? 'database' : 'ai_estimate'
      };
    });

    const labels = matchedFoods.map(f => f.name);

    res.json({ labels, matchedFoods });

  } catch (err) {
    console.error('Scan-food route failed:', err);
    res.status(500).json({ error: 'Food scan request failed: ' + err.message });
  }
});

// GET workout template + this week's completion status
app.get('/api/workout', requireLogin, (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.currentUserId);
  const templateName = (profile && (profile.fitness_level === 'Advanced' || profile.fitness_level === 'Elite'))
    ? 'Push Pull Legs' : 'Full Body';

  // Get completions from the last 7 days
  const completions = db.prepare(`
    SELECT day_name, workout_name FROM workout_logs
    WHERE user_id = ? AND logged_at >= date('now', '-7 days')
  `).all(req.currentUserId);

  res.json({ templateName, completions });
});

// POST mark a workout as complete
app.post('/api/workout/complete', requireLogin, (req, res) => {
  const { day_name, workout_name } = req.body;

  if (!day_name || !workout_name) {
    return res.status(400).json({ error: 'Missing workout info' });
  }

  const already = db.prepare(`
    SELECT id FROM workout_logs WHERE user_id = ? AND day_name = ? AND logged_at = date('now')
  `).get(req.currentUserId, day_name);

  if (already) {
    return res.json({ message: 'Already marked complete today' });
  }

  db.prepare('INSERT INTO workout_logs (user_id, day_name, workout_name) VALUES (?, ?, ?)')
    .run(req.currentUserId, day_name, workout_name);

  res.json({ message: 'Workout marked complete' });
});

// GET dashboard overview - combines data from all features for the landing page
app.get('/api/dashboard', requireLogin, (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.currentUserId);
  const user = db.prepare('SELECT name FROM users WHERE id = ?').get(req.currentUserId);

  const latestWeight = db.prepare('SELECT * FROM weight_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 1').get(req.currentUserId);
  const cardioTotals = db.prepare('SELECT COALESCE(SUM(calories),0) as totalKcal FROM cardio_sessions WHERE user_id = ? AND logged_at >= date(\'now\', \'-7 days\')').get(req.currentUserId);
  const workoutsThisWeek = db.prepare('SELECT COUNT(*) as count FROM workout_logs WHERE user_id = ? AND logged_at >= date(\'now\', \'-7 days\')').get(req.currentUserId);
  const todaysFood = db.prepare('SELECT COALESCE(SUM(calories),0) as totalKcal FROM food_logs WHERE user_id = ? AND date(logged_at) = date(\'now\')').get(req.currentUserId);

  res.json({
    userName: user.name,
    hasProfile: !!profile,
    fitnessLevel: profile ? profile.fitness_level : null,
    latestWeight: latestWeight ? latestWeight.weight : null,
    targetWeight: profile ? profile.target_weight : null,
    caloriesBurnedThisWeek: Math.round(cardioTotals.totalKcal),
    workoutsThisWeek: workoutsThisWeek.count,
    foodLoggedToday: Math.round(todaysFood.totalKcal)
  });
});

// GET summary stats for the Progress page (now uses real workout completion data)
app.get('/api/summary', requireLogin, (req, res) => {
  const weightCount = db.prepare('SELECT COUNT(*) as count FROM weight_logs WHERE user_id = ?').get(req.currentUserId).count;
  const cardioTotals = db.prepare('SELECT COALESCE(SUM(calories),0) as totalKcal FROM cardio_sessions WHERE user_id = ?').get(req.currentUserId);
  const workoutsThisWeek = db.prepare(`
    SELECT COUNT(*) as count FROM workout_logs
    WHERE user_id = ? AND logged_at >= date('now', '-7 days')
  `).get(req.currentUserId).count;

  res.json({
    totalWorkouts: 5, // 5 non-rest days in the standard weekly template
    completedWorkouts: workoutsThisWeek,
    caloriesBurned: Math.round(cardioTotals.totalKcal),
    weightEntries: weightCount
  });
});

// JIYA AI - real LLM-powered chat trainer (via Groq, free tier), personalized using saved profile data
app.post('/api/jiya', requireLogin, async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const profile = db.prepare('SELECT * FROM profiles WHERE user_id = ?').get(req.currentUserId);
  const fitnessLevel = profile ? profile.fitness_level : 'Beginner';
  const weight = profile ? profile.weight : null;
  const goals = profile ? JSON.parse(profile.goals || '[]') : [];
  const sports = profile ? JSON.parse(profile.sports || '[]') : [];

  const systemPrompt = `You are Jiya, a friendly, knowledgeable AI fitness trainer inside the FlexFit AI app.
Answer workout, nutrition, and general fitness questions directly and helpfully, including simple healthy recipes when asked.
Keep replies concise (a few short paragraphs or a simple list) — this is a mobile chat UI, not an essay.
User context: fitness level = ${fitnessLevel}${weight ? `, weight = ${weight}kg` : ''}${goals.length ? `, goals = ${goals.join(', ')}` : ''}${sports.length ? `, sports = ${sports.join(', ')}` : ''}.
If asked something outside fitness/nutrition/training, gently steer back to what you can help with.
Do not give medical diagnoses; suggest seeing a doctor for medical concerns.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b',
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API error:', response.status, errText);
      return res.status(502).json({ reply: "Sorry, I couldn't think that through just now — try again in a moment." });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I didn't quite catch that — try rephrasing?";

    res.json({ reply });

  } catch (err) {
    console.error('Jiya route failed:', err);
    res.status(500).json({ reply: "Something went wrong reaching Jiya. Please try again." });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`FlexFit server running on port ${PORT}`);
});
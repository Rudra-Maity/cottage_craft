const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
require('dotenv/config')

const app = express();
const port = 3500;
// console.log()
// Secret key for JWT
const secretKey = process.env.auth_secrete; // Replace with a strong secret key in production

app.use(express.json());
app.use(cookieParser());

// Mock user database (for demonstration purposes)
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' },
];

// Login route to generate JWT and set as a cookie
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  // Check if the user exists and the password is correct (in a real app, you'd use a database)
  const user = users.find(u => u.id === id && u.password === password);

  if (!user) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  // Generate a JWT with an expiration time (e.g., 1 hour)
  const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

  // Set the JWT as an HttpOnly and Secure cookie
  res.cookie('jwtToken', token, { httpOnly: true, secure: true, maxAge: 31536000000,});
  res.json({ message: 'Login successful' });
});

// Protected route that requires a valid JWT
app.get('/protected', (req, res) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Verify and decode the JWT
    const decoded = jwt.verify(token, secretKey);

    // You can now use the 'decoded' object to access user data (e.g., user ID)
    res.json({ message: 'Protected resource accessed', user: decoded });
  } catch (error) {
    const decoded = jwt.verify(token, secretKey);
    return res.status(401).json({ message: 'Unauthorized',decoded });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

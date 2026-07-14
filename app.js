require('dotenv').config();

const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const postsRouter = require('./routes/posts');
const authRouter = require('./routes/auth');
const { attachUser } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  app.set('trust proxy', 1);
}

app.use(
  cors({
    origin: isProd
      ? true
      : process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'inked-dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: isProd ? 'lax' : 'lax',
      secure: isProd,
    },
  })
);

app.use(attachUser);

app.use('/api/auth', authRouter);
app.use('/api/blogs', postsRouter);
// Alias from the assignment example (e.g. /blogs)
app.use('/blogs', postsRouter);

const clientDist = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDist));

app.get(/^\/(?!api|blogs).*/, (req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.status(404).json({ error: 'Frontend not built. Run npm run build in /client.' });
    }
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Blog API running on port ${PORT}`);
});

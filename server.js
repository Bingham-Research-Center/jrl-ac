import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';
import helmet from 'helmet';
import blogRoutes from './src/routes/blog.js';
import teamRoutes from './src/routes/team.js';
import videosRoutes from './src/routes/videos.js';
import pdfRoutes from './src/routes/pdfs.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      mediaSrc: ["'self'", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      upgradeInsecureRequests: null,
    },
  },
}));
app.use(compression());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('pages/home', {
    title: 'Lawson Group - Research & Outreach',
    page: 'home'
  });
});

app.use('/blog', blogRoutes);
app.use('/team', teamRoutes);
app.use('/videos', videosRoutes);
app.use('/pdfs', pdfRoutes);

app.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About - Lawson Group',
    page: 'about'
  });
});

app.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 - Page Not Found',
    page: '404'
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
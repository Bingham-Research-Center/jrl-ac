import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const VIDEOS_DIR = path.join(__dirname, '../../public/videos');
const VIDEOS_META = path.join(__dirname, '../../content/videos-meta.json');

async function getVideos() {
  try {
    const metaContent = await fs.readFile(VIDEOS_META, 'utf-8');
    return JSON.parse(metaContent);
  } catch (error) {
    return [
      {
        id: 'sample-1',
        title: 'Sample Research Video',
        description: 'Introduction to our weather research',
        thumbnail: '/images/video-thumb-1.jpg',
        url: '/videos/sample.mp4',
        category: 'research',
        duration: '5:23',
        date: new Date().toISOString()
      }
    ];
  }
}

router.get('/', async (req, res) => {
  const videos = await getVideos();
  const categories = ['all', 'research', 'educational', 'social', 'longform'];
  
  res.render('pages/videos', {
    title: 'Videos - Lawson Group',
    page: 'videos',
    videos,
    categories,
    selectedCategory: req.query.category || 'all'
  });
});

export default router;
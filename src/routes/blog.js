import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllPosts, getPostBySlug, filterPostsByTag } from '../utils/markdown.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const POSTS_DIR = path.join(__dirname, '../../content/posts');

router.get('/', async (req, res) => {
  const { tag } = req.query;
  const allPosts = await getAllPosts(POSTS_DIR);
  const posts = filterPostsByTag(allPosts, tag);
  
  const tags = ['ALL', 'LOCAL', 'USA', 'WORLD', 'TEAM', 'FUN'];
  
  res.render('pages/blog', {
    title: 'Blog - Lawson Group',
    page: 'blog',
    posts,
    selectedTag: tag || 'ALL',
    tags
  });
});

router.get('/post/:slug', async (req, res) => {
  const post = await getPostBySlug(POSTS_DIR, req.params.slug);
  
  if (!post) {
    return res.status(404).render('pages/404', {
      title: '404 - Post Not Found',
      page: '404'
    });
  }
  
  res.render('pages/post', {
    title: `${post.title} - Lawson Group`,
    page: 'blog',
    post
  });
});

export default router;
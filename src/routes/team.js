import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const TEAM_DIR = path.join(__dirname, '../../content/team');

async function getTeamMembers() {
  try {
    const files = await fs.readdir(TEAM_DIR);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const members = await Promise.all(
      mdFiles.map(async (file) => {
        const content = await fs.readFile(path.join(TEAM_DIR, file), 'utf-8');
        const lines = content.split('\n');
        
        const name = lines[0]?.replace(/^#\s+/, '') || 'Team Member';
        const role = lines[1]?.replace(/^##\s+/, '') || 'Researcher';
        const bio = marked(lines.slice(2).join('\n'));
        
        const slug = file.replace('.md', '');
        
        return {
          name,
          role,
          bio,
          slug,
          images: {
            action: `/images/team/${slug}-action.jpg`,
            headshot: `/images/team/${slug}-headshot.jpg`,
            passion: `/images/team/${slug}-passion.jpg`
          }
        };
      })
    );
    
    return members;
  } catch (error) {
    console.error('Error loading team members:', error);
    return [];
  }
}

router.get('/', async (req, res) => {
  const members = await getTeamMembers();
  
  res.render('pages/team', {
    title: 'Team - Lawson Group',
    page: 'team',
    members
  });
});

export default router;
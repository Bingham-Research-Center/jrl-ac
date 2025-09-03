import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import publicationsService from '../services/publications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = express.Router();

const PDFS_DIR = path.join(__dirname, '../../public/pdfs');
const PDFS_META = path.join(__dirname, '../../content/pdfs-meta.json');

async function getPDFs() {
  try {
    const metaContent = await fs.readFile(PDFS_META, 'utf-8');
    return JSON.parse(metaContent);
  } catch (error) {
    return [
      {
        id: 'cv',
        title: 'Curriculum Vitae',
        description: 'Academic CV with publications and research experience',
        filename: 'jrl-cv.pdf',
        category: 'personal',
        date: new Date().toISOString()
      }
    ];
  }
}

async function getTeamMembers() {
  // For now, return default team members
  // In production, this would come from a database or team service
  const members = [
    {
      name: 'John Lawson',
      slug: 'lawson',
      scholarUrl: 'https://scholar.google.com/citations?user=YOUR_ID_HERE'
    }
  ];
  
  // Fetch publications for each member
  const membersWithPublications = await Promise.all(
    members.map(async (member) => {
      const publications = await publicationsService.getPublicationsForMember(member.slug);
      return { ...member, publications };
    })
  );
  
  return membersWithPublications;
}

router.get('/', async (req, res) => {
  const [pdfs, teamMembers] = await Promise.all([
    getPDFs(),
    getTeamMembers()
  ]);
  
  res.render('pages/resources', {
    title: 'Resources - Lawson Group',
    page: 'resources',
    pdfs,
    teamMembers
  });
});

router.get('/download/:filename', (req, res) => {
  const filePath = path.join(PDFS_DIR, req.params.filename);
  res.download(filePath);
});

export default router;
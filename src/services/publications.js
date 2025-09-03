import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLICATIONS_DIR = path.join(__dirname, '../../content/publications');

class PublicationsService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  async getPublicationsForMember(memberSlug) {
    const cacheKey = `pubs-${memberSlug}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // First try to load from markdown file
      const markdownPath = path.join(PUBLICATIONS_DIR, `publications-${memberSlug}.md`);
      const markdownPublications = await this.loadFromMarkdown(markdownPath);
      
      if (markdownPublications) {
        this.cache.set(cacheKey, {
          data: markdownPublications,
          timestamp: Date.now()
        });
        return markdownPublications;
      }

      // If no markdown, try Google Scholar (placeholder for now)
      const scholarPublications = await this.fetchFromGoogleScholar(memberSlug);
      
      if (scholarPublications) {
        this.cache.set(cacheKey, {
          data: scholarPublications,
          timestamp: Date.now()
        });
        return scholarPublications;
      }

      return this.getDefaultPublications();
    } catch (error) {
      console.error('Error fetching publications:', error);
      return this.getDefaultPublications();
    }
  }

  async loadFromMarkdown(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return this.parseMarkdownPublications(content);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Error reading markdown file:', error);
      }
      return null;
    }
  }

  parseMarkdownPublications(markdown) {
    const publications = {
      recent: [],
      featured: [],
      all: []
    };

    // Parse markdown sections
    const sections = markdown.split(/^##\s+/m).filter(Boolean);
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(line => line.trim());
      const sectionTitle = lines[0].toLowerCase();
      
      if (sectionTitle.includes('recent')) {
        publications.recent = this.parsePublicationList(lines.slice(1));
      } else if (sectionTitle.includes('featured')) {
        publications.featured = this.parsePublicationList(lines.slice(1));
      } else if (sectionTitle.includes('all')) {
        publications.all = this.parsePublicationList(lines.slice(1));
      }
    });

    return publications;
  }

  parsePublicationList(lines) {
    const publications = [];
    let currentPub = null;

    lines.forEach(line => {
      // Check if line starts with a bullet or number
      if (/^[\-\*\d+\.]\s+/.test(line)) {
        if (currentPub) {
          publications.push(currentPub);
        }
        
        // Extract title and DOI link
        const cleanLine = line.replace(/^[\-\*\d+\.]\s+/, '');
        const doiMatch = cleanLine.match(/\[([^\]]+)\]\(([^)]+)\)/);
        
        if (doiMatch) {
          currentPub = {
            title: doiMatch[1],
            doi: doiMatch[2],
            description: cleanLine.replace(doiMatch[0], '').trim()
          };
        } else {
          currentPub = {
            title: cleanLine,
            doi: null,
            description: ''
          };
        }
      } else if (currentPub && line.trim()) {
        // Additional metadata lines
        if (line.includes('Authors:')) {
          currentPub.authors = line.replace('Authors:', '').trim();
        } else if (line.includes('Journal:')) {
          currentPub.journal = line.replace('Journal:', '').trim();
        } else if (line.includes('Year:')) {
          currentPub.year = line.replace('Year:', '').trim();
        } else {
          currentPub.description += ' ' + line.trim();
        }
      }
    });

    if (currentPub) {
      publications.push(currentPub);
    }

    return publications;
  }

  async fetchFromGoogleScholar(memberSlug) {
    // Placeholder for Google Scholar API integration
    // In production, you would implement actual API calls here
    // For now, return null to fall back to defaults
    
    // Example implementation would be:
    // const scholarId = await this.getScholarId(memberSlug);
    // const publications = await this.fetchScholarPublications(scholarId);
    // return this.formatScholarPublications(publications);
    
    return null;
  }

  getDefaultPublications() {
    return {
      recent: [
        {
          title: "Sample Recent Publication 1",
          doi: "https://doi.org/10.1234/sample1",
          authors: "Lawson, J., et al.",
          journal: "Journal of Example Research",
          year: "2024",
          description: "A groundbreaking study on advanced research methodologies."
        },
        {
          title: "Sample Recent Publication 2",
          doi: "https://doi.org/10.1234/sample2",
          authors: "Lawson, J., Smith, A.",
          journal: "International Conference on Science",
          year: "2024",
          description: "Novel approaches to interdisciplinary research."
        },
        {
          title: "Sample Recent Publication 3",
          doi: "https://doi.org/10.1234/sample3",
          authors: "Lawson, J.",
          journal: "Nature Communications",
          year: "2023",
          description: "Comprehensive analysis of emerging technologies."
        }
      ],
      featured: [
        {
          title: "Featured Landmark Study",
          doi: "https://doi.org/10.1234/featured1",
          authors: "Lawson, J., et al.",
          journal: "Science",
          year: "2023",
          description: "This seminal work established new paradigms in the field."
        },
        {
          title: "Award-Winning Research",
          doi: "https://doi.org/10.1234/featured2",
          authors: "Lawson, J., et al.",
          journal: "Proceedings of the National Academy",
          year: "2022",
          description: "Recipient of the Best Paper Award for innovative methodology."
        },
        {
          title: "Highly Cited Review",
          doi: "https://doi.org/10.1234/featured3",
          authors: "Lawson, J.",
          journal: "Annual Review of Research",
          year: "2021",
          description: "Comprehensive review cited over 500 times in subsequent research."
        }
      ],
      all: []
    };
  }
}

export default new PublicationsService();
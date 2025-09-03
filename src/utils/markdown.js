import { marked } from 'marked';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

export async function parseMarkdownFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const title = lines[0]?.replace(/^#\s+/, '') || 'Untitled';
    const author = lines[1]?.replace(/^##\s+/, '') || 'Unknown Author';
    const tagLine = lines[2] || '';
    const tagMatch = tagLine.match(/####\s*TAG:\s*(\w+)/i);
    const tag = tagMatch ? tagMatch[1].toUpperCase() : 'GENERAL';
    
    const bodyContent = lines.slice(3).join('\n').trim();
    const html = marked(bodyContent);
    
    const firstImageMatch = bodyContent.match(/!\[.*?\]\((.*?)\)/);
    const firstImage = firstImageMatch ? firstImageMatch[1] : null;
    
    const preview = bodyContent
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/[#*`\[\]]/g, '')
      .trim()
      .split('\n')
      .filter(line => line.trim())
      .slice(0, 3)
      .join(' ')
      .substring(0, 200);
    
    const stats = await fs.stat(filePath);
    
    return {
      title,
      author,
      tag,
      html,
      preview,
      firstImage,
      fileName: path.basename(filePath),
      date: stats.mtime,
      rawContent: content
    };
  } catch (error) {
    console.error(`Error parsing markdown file ${filePath}:`, error);
    return null;
  }
}

export async function getAllPosts(postsDir) {
  try {
    const files = await fs.readdir(postsDir);
    const mdFiles = files.filter(file => file.endsWith('.md'));
    
    const posts = await Promise.all(
      mdFiles.map(file => parseMarkdownFile(path.join(postsDir, file)))
    );
    
    return posts
      .filter(post => post !== null)
      .sort((a, b) => b.date - a.date);
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
}

export async function getPostBySlug(postsDir, slug) {
  const filePath = path.join(postsDir, `${slug}.md`);
  return await parseMarkdownFile(filePath);
}

export function filterPostsByTag(posts, tag) {
  if (!tag || tag === 'ALL') return posts;
  return posts.filter(post => post.tag === tag.toUpperCase());
}
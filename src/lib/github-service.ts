import type { GithubContent, NovelInfo, Chapter, Novel } from './types';

const GITHUB_API_URL = 'https://api.github.com/repos/Nova-Prolab/novels/contents/';
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/Nova-Prolab/novels/main/';

async function fetchFromGithub<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${GITHUB_API_URL}${path}`, {
        next: { revalidate: 3600 } // Revalidate every hour
    });
    if (!response.ok) {
      // console.error(`Failed to fetch ${path}: ${response.statusText}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    // console.error(`Error fetching from github: ${error}`);
    return null;
  }
}

async function fetchRawContent(path: string): Promise<string | null> {
    try {
        const response = await fetch(`${GITHUB_RAW_URL}${path}`, {
            next: { revalidate: 3600 } // Revalidate every hour
        });
        if (!response.ok) {
            // console.error(`Failed to fetch raw content ${path}: ${response.statusText}`);
            return null;
        }
        return await response.text();
    } catch (error) {
        // console.error(`Error fetching raw content: ${error}`);
        return null;
    }
}


export async function getNovelList(): Promise<Novel[]> {
  const novelDirs = await fetchFromGithub<GithubContent[]>('');
  if (!novelDirs) return [];

  const novelPromises = novelDirs
    .filter(item => item.type === 'dir' && !item.name.startsWith('.'))
    .map(async (dir): Promise<Novel | null> => {
      const info = await getNovelInfo(dir.name);
      if (!info) return null;
      
      return {
        id: dir.name,
        title: info.titulo,
        author: info.autor,
        description: info.descripcion,
        category: info.categoria,
        coverImageUrl: info.coverImageUrl,
        tags: info.etiquetas,
        status: info.status,
        ageRating: info.ageRating,
        releaseDate: info.fecha_lanzamiento,
        chapters: [], // Fetched on demand
      };
    });
  
  const novels = await Promise.all(novelPromises);
  return novels.filter((novel): novel is Novel => novel !== null);
}


export async function getNovelDetails(novelId: string): Promise<Novel | null> {
    const info = await getNovelInfo(novelId);
    if (!info) return null;

    const chapters = await getChapters(novelId);

    return {
        id: novelId,
        title: info.titulo,
        author: info.autor,
        description: info.descripcion,
        category: info.categoria,
        coverImageUrl: info.coverImageUrl,
        tags: info.etiquetas,
        status: info.status,
        ageRating: info.ageRating,
        translator: info.traductor,
        releaseDate: info.fecha_lanzamiento,
        chapters: chapters
    };
}


export async function getNovelInfo(novelId: string): Promise<NovelInfo | null> {
    const content = await fetchRawContent(`${novelId}/info.json`);
    if (!content) return null;
    try {
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error parsing info.json for ${novelId}:`, error);
        return null;
    }
}


export async function getChapters(novelId: string): Promise<Chapter[]> {
    const info = await getNovelInfo(novelId);

    // If info.json has a chapter list, use it for structure. Titles will be fetched later.
    if (info?.capitulos && info.capitulos.length > 0) {
        return info.capitulos.map(c => ({
            id: c.id,
            title: c.titulo, // Use title from info.json if available
            content: '', // Fetched on demand
        }));
    }

    // Fallback to scanning directory if info.json doesn't have chapters
    const files = await fetchFromGithub<GithubContent[]>(novelId);
    if (!files) return [];

    const chapterFiles = files
        .filter(file => file.type === 'file' && file.name.startsWith('chapter-') && file.name.endsWith('.html'))
        .sort((a, b) => {
            const numA = parseInt(a.name.match(/(\d+)/)?.[0] || '0', 10);
            const numB = parseInt(b.name.match(/(\d+)/)?.[0] || '0', 10);
            return numA - numB;
        });
    
    // Fetch all chapter titles in parallel to be more efficient
    const chapters = await Promise.all(
        chapterFiles.map(async (file) => {
            const chapterId = parseInt(file.name.match(/(\d+)/)?.[0] || '0', 10);
            const content = await fetchRawContent(file.path);
            let title = `Chapter ${chapterId}`;
            if (content) {
                const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
                if (titleMatch && titleMatch[1]) {
                    title = titleMatch[1];
                }
            }
            return {
                id: chapterId,
                title: title,
                content: '' // Fetched on demand
            };
        })
    );
    
    return chapters;
}


export async function getChapterContent(novelId: string, chapterId: number): Promise<Chapter | null> {
    const content = await fetchRawContent(`${novelId}/chapter-${chapterId}.html`);
    if (!content) return null;

    let title = `Chapter ${chapterId}`;
    const titleMatch = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
    if (titleMatch && titleMatch[1]) {
        title = titleMatch[1];
    } else {
        // Fallback to info.json if h1 is missing
        const info = await getNovelInfo(novelId);
        if (info?.capitulos) {
            const chapterInfo = info.capitulos.find(c => c.id === chapterId);
            if (chapterInfo) {
                title = chapterInfo.titulo;
            }
        }
    }
    
    // Naive approach to strip HTML for plain text display
    const plainContent = content.replace(/<[^>]+>/g, '\n').replace(/\n\n+/g, '\n\n').trim();

    return {
        id: chapterId,
        title: title,
        content: plainContent
    };
}


export type Chapter = {
  id: number;
  title: string;
  content: string;
};

export type Novel = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  coverImageUrl: string;
  tags: string[];
  chapters: Chapter[];
  status?: string;
  translator?: string;
  ageRating?: string;
  releaseDate?: string;
};

export type ReadingProgress = {
  [novelId: string]: {
    chapterId: number;
    scrollPosition: number;
  };
};

export interface GithubContent {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir";
  _links: {
    self: string;
    git: string;
    html: string;
  };
}

export type NovelInfo = {
  titulo: string;
  descripcion: string;
  coverImageUrl: string;
  ageRating: string;
  fecha_lanzamiento: string;
  etiquetas: string[];
  categoria: string;
  autor: string;
  traductor: string;
  status: string;
  rating_platform: number;
};

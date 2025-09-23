export type Chapter = {
  id: number;
  title: string;
  content: string;
};

export type Novel = {
  id: string;
  title: string;
  author: string;
  coverImageId: string;
  tags: string[];
  chapters: Chapter[];
};

export type ReadingProgress = {
  [novelId: string]: {
    chapterId: number;
    scrollPosition: number;
  };
};

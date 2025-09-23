"use server";

import { summarizeChapter } from '@/ai/flows/chapter-summary';
import type { SummarizeChapterInput } from '@/ai/flows/chapter-summary';

export async function getChapterSummary(input: SummarizeChapterInput) {
  try {
    const result = await summarizeChapter(input);
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { summary: null, error: 'Failed to generate summary. Please try again later.' };
  }
}

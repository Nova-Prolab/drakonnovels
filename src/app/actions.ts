"use server";

import { summarizeChapter } from '@/ai/flows/chapter-summary';
import type { SummarizeChapterInput } from '@/ai/flows/chapter-summary';
import { translateChapter } from '@/ai/flows/translate-chapter-flow';

export async function getChapterSummary(input: SummarizeChapterInput) {
  try {
    const result = await summarizeChapter(input);
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error("Error generating summary:", error);
    return { summary: null, error: 'No se pudo generar el resumen. Por favor, inténtalo de nuevo más tarde.' };
  }
}

export async function getChapterTranslation(chapterText: string, language: string) {
  try {
    const result = await translateChapter({ chapterText, language });
    return { translatedText: result.translatedText, error: null };
  } catch (error) {
    console.error("Error generating translation:", error);
    return { translatedText: null, error: 'No se pudo generar la traducción. Por favor, inténtalo de nuevo más tarde.' };
  }
}

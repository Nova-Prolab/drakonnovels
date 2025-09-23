'use server';

/**
 * @fileOverview Provides a translation of a given chapter of a novel.
 *
 * - translateChapter - A function that generates a translation of a chapter.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateChapterInputSchema = z.object({
  chapterText: z
    .string()
    .describe('The text content of the chapter to be translated.'),
  language: z.string().describe('The language to translate the chapter to.'),
});
type TranslateChapterInput = z.infer<typeof TranslateChapterInputSchema>;

const TranslateChapterOutputSchema = z.object({
  translatedText: z.string().describe('The translated chapter text.'),
});
type TranslateChapterOutput = z.infer<typeof TranslateChapterOutputSchema>;


export async function translateChapter(input: TranslateChapterInput): Promise<TranslateChapterOutput> {
  const translateChapterPrompt = ai.definePrompt({
    name: 'translateChapterPrompt',
    input: {schema: TranslateChapterInputSchema},
    output: {schema: TranslateChapterOutputSchema},
    prompt: `Translate the following chapter text into {{language}}. Return the full translated text.

It is crucial that you preserve the original paragraph structure. Where there are double line breaks in the original text, there must be double line breaks in the translated text.

Chapter Text:
{{{chapterText}}}`,
    system: 'You are a literary translator. You will translate the provided text accurately and completely, preserving all original formatting, especially paragraph breaks.'
  });

  const {output} = await translateChapterPrompt(input);
  return output!;
}

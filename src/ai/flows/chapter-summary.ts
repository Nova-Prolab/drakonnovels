'use server';

/**
 * @fileOverview Provides a summary of a given chapter of a novel, with tool use to make sure important information is included.
 *
 * - summarizeChapter - A function that generates a summary of a chapter.
 * - SummarizeChapterInput - The input type for the summarizeChapter function.
 * - SummarizeChapterOutput - The return type for the summarizeChapter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeChapterInputSchema = z.object({
  chapterText: z
    .string()
    .describe('The text content of the chapter to be summarized.'),
  novelTitle: z.string().describe('The title of the novel.'),
  chapterNumber: z.number().describe('The chapter number.'),
});
export type SummarizeChapterInput = z.infer<typeof SummarizeChapterInputSchema>;


const SummarizeChapterOutputSchema = z.object({
  summary: z.array(z.object({
    phrase: z.string().describe("The highlighted phrase from the summary."),
    explanation: z.string().describe("A detailed explanation of the phrase, referencing events from the chapter."),
    color: z.string().describe("A thematic color for the highlight (e.g., 'blue', 'green', 'purple', 'orange', 'red').")
  })).describe("An array of summary objects, each containing a phrase, an explanation, and a color for highlighting.")
});
export type SummarizeChapterOutput = z.infer<typeof SummarizeChapterOutputSchema>;

export async function summarizeChapter(input: SummarizeChapterInput): Promise<SummarizeChapterOutput> {
  return summarizeChapterFlow(input);
}

const summarizeChapterPrompt = ai.definePrompt({
  name: 'summarizeChapterPrompt',
  input: {schema: SummarizeChapterInputSchema},
  output: {schema: SummarizeChapterOutputSchema},
  prompt: `Generate a list of the 4 to 6 most important events from the provided chapter text of the novel "{{novelTitle}}". 
For each event, create a concise "phrase" that summarizes it.
Then, write a detailed "explanation" for that phrase, elaborating on the event and its context within the chapter.
Finally, assign a "color" for highlighting the phrase from one of the following options: 'blue', 'green', 'purple', 'orange', 'red'. Use different colors for different events.

Chapter Text:
{{{chapterText}}}`,
  system: 'You are a world-class book summarizer. Your task is to identify key events and provide detailed context for them in a structured format.'
});

const summarizeChapterFlow = ai.defineFlow(
  {
    name: 'summarizeChapterFlow',
    inputSchema: SummarizeChapterInputSchema,
    outputSchema: SummarizeChapterOutputSchema,
  },
  async input => {
    const {output} = await summarizeChapterPrompt(input);
    return output!;
  }
);

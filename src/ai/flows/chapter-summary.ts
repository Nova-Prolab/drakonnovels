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
    explanation: z.string().describe("A detailed explanation of the phrase, referencing events from the chapter, formatted using Markdown for emphasis (bold, italics)."),
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
  prompt: `Detect the language of the following chapter from the novel "{{novelTitle}}".
Generate a list of 4 to 6 most important events from the provided chapter text.

For each event, follow these steps:
1.  **Phrase**: Create a concise "phrase" that summarizes the event.
2.  **Explanation**: Write a detailed "explanation" for that phrase. Elaborate on the event and its context within the chapter. Use Markdown syntax (like **bold** for names or *italics* for concepts) to add emphasis to key points in the explanation.
3.  **Color**: Assign a unique "color" for highlighting the phrase from the following options: 'blue', 'green', 'purple', 'orange', 'red'. You must not repeat colors within the same summary.

It is crucial that the entire output (phrases, explanations, etc.) is in the same language as the detected chapter text.

Chapter Text:
{{{chapterText}}}`,
  system: 'You are a world-class book summarizer. Your task is to identify key events and provide detailed, well-formatted context for them in a structured format, always responding in the language of the provided text.'
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

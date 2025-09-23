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

const ImportantEventsOutputSchema = z.object({
  importantEvents: z.array(z.string()).describe('A list of the most important events that occurred in this chapter.')
});
export type ImportantEventsOutput = z.infer<typeof ImportantEventsOutputSchema>;

const SummarizeChapterOutputSchema = z.object({
  summary: z.string().describe('A short summary of the chapter.'),
});
export type SummarizeChapterOutput = z.infer<typeof SummarizeChapterOutputSchema>;

const getImportantEvents = ai.defineTool({
    name: 'getImportantEvents',
    description: 'Retrieves a list of the most important events from the chapter.',
    inputSchema: z.object({
      chapterText: z.string().describe('The text content of the chapter to be summarized.'),
    }),
    outputSchema: ImportantEventsOutputSchema,
  },
  async (input) => {
    // This can call any typescript function.
    console.log("TOOL: Summarizing to retrieve most important events.");
    return {
      importantEvents: []
    };
  }
);

export async function summarizeChapter(input: SummarizeChapterInput): Promise<SummarizeChapterOutput> {
  return summarizeChapterFlow(input);
}

const summarizeChapterPrompt = ai.definePrompt({
  name: 'summarizeChapterPrompt',
  input: {schema: SummarizeChapterInputSchema},
  output: {schema: SummarizeChapterOutputSchema},
  tools: [getImportantEvents],
  prompt: `Summarize chapter {{chapterNumber}} of the novel "{{novelTitle}}" in a few sentences, including the important events (if any) that you retrieved with the getImportantEvents tool.\n\nChapter Text: {{{chapterText}}} `,
  system: 'You are a world-class book summarizer. If there are important events that you retrieved with the getImportantEvents tool, then you MUST include them in your summary.'
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

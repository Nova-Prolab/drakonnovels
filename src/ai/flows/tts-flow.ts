'use server';

/**
 * @fileOverview Provides a text-to-speech service for a chapter.
 *
 * - textToSpeech - A function that generates audio from text.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TTSInputSchema = z.object({
  text: z.string().describe('The text to be converted to speech.'),
});
type TTSInput = z.infer<typeof TTSInputSchema>;

const TTSOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio as a data URI.'),
});
type TTSOutput = z.infer<typeof TTSOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const ttsFlow = ai.defineFlow(
    {
      name: 'ttsFlow',
      inputSchema: TTSInputSchema,
      outputSchema: TTSOutputSchema,
    },
    async ({text}) => {
        const {media} = await ai.generate({
            model: 'googleai/gemini-2.5-flash-preview-tts',
            config: {
                responseModalities: ['AUDIO'],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {voiceName: 'Algenib'},
                    },
                },
            },
            prompt: text,
        });

        if (!media) {
            throw new Error('No media returned from TTS model');
        }

        const audioBuffer = Buffer.from(
            media.url.substring(media.url.indexOf(',') + 1),
            'base64'
        );

        const wavBase64 = await toWav(audioBuffer);
        
        return {
            audioDataUri: 'data:audio/wav;base64,' + wavBase64,
        };
    }
);


export async function textToSpeech(input: TTSInput): Promise<TTSOutput> {
  return ttsFlow(input);
}

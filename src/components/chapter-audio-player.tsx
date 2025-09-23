
"use client";

import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Volume2, Loader2, Play, Pause, AlertCircle } from 'lucide-react';
import { getChapterAudio } from '@/app/actions';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '@/hooks/use-toast';

type ChapterAudioPlayerProps = {
  chapterText: string;
};

export function ChapterAudioPlayer({ chapterText }: ChapterAudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioDataUri, setAudioDataUri] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  const handleGenerateAudio = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getChapterAudio(chapterText);
      if (result.audioDataUri) {
        setAudioDataUri(result.audioDataUri);
      } else {
        setError(result.error || 'Ocurrió un error desconocido.');
        toast({
            variant: "destructive",
            title: "Error de Audio",
            description: result.error || 'No se pudo generar el audio.',
        })
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setError(errorMessage);
       toast({
            variant: "destructive",
            title: "Error de Audio",
            description: 'No se pudo generar el audio.',
        })
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div>
      <Popover onOpenChange={(open) => !open && setIsPlaying(false)}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Escuchar capítulo">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="flex flex-col gap-4 items-center">
            <h4 className="font-medium leading-none">Reproductor de Audio</h4>

            {error && (
               <Alert variant="destructive">
                 <AlertCircle className="h-4 w-4" />
                 <AlertDescription>
                    {error}
                 </AlertDescription>
               </Alert>
            )}

            {!audioDataUri && !error && (
              <Button onClick={handleGenerateAudio} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Volume2 className="mr-2 h-4 w-4" />
                )}
                Generar Audio
              </Button>
            )}

            {audioDataUri && (
              <div className="flex items-center gap-2">
                <Button onClick={togglePlayPause} size="icon" variant="outline">
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <audio
                  ref={audioRef}
                  src={audioDataUri}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                />
              </div>
            )}
            
            <p className="text-xs text-muted-foreground text-center">
              La generación de audio puede tardar unos segundos.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

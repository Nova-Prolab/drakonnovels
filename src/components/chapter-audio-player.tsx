
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Volume2, Play, Pause, Square } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

type ChapterAudioPlayerProps = {
  chapterText: string;
};

type SpeechState = "idle" | "playing" | "paused";

export function ChapterAudioPlayer({ chapterText }: ChapterAudioPlayerProps) {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const paragraphsRef = useRef<string[]>([]);
  const currentParagraphIndexRef = useRef<number>(0);
  const { toast } = useToast();

  const cleanUpSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    }
    currentParagraphIndexRef.current = 0;
    setSpeechState("idle");
  }, []);
  
  useEffect(() => {
    paragraphsRef.current = chapterText.split('\\n').filter(p => p.trim() !== '');
    return () => {
      cleanUpSpeech();
    };
  }, [chapterText, cleanUpSpeech]);

  const speakParagraph = (index: number) => {
    if (index >= paragraphsRef.current.length || typeof window === "undefined" || !window.speechSynthesis) {
      cleanUpSpeech();
      return;
    }

    const paragraph = paragraphsRef.current[index];
    const utterance = new SpeechSynthesisUtterance(paragraph);
    utterance.lang = "es-ES";

    utterance.onstart = () => setSpeechState("playing");
    utterance.onpause = () => setSpeechState("paused");
    utterance.onresume = () => setSpeechState("playing");
    utterance.onend = () => {
      currentParagraphIndexRef.current += 1;
      speakParagraph(currentParagraphIndexRef.current);
    };
    utterance.onerror = (event) => {
      console.error("SpeechSynthesis Error:", event);
      toast({
          title: "Error de Audio",
          description: "No se pudo reproducir el audio. Por favor, inténtalo de nuevo.",
          variant: "destructive",
      });
      cleanUpSpeech();
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const handlePlay = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
        toast({
            title: "Error",
            description: "Tu navegador no soporta la síntesis de voz.",
            variant: "destructive",
        });
        return;
    }
    
    cleanUpSpeech();
    speakParagraph(0);
  };
  
  const handlePause = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.pause();
    }
  };
  
  const handleResume = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.resume();
    }
  };

  const handleStop = () => {
    cleanUpSpeech();
  };

  const getPlayButton = () => {
    switch(speechState) {
        case 'idle':
            return (
                <Button onClick={handlePlay} size="lg" className="w-full">
                    <Play className="mr-2" />
                    Reproducir Audio
                </Button>
            );
        case 'playing':
            return (
                <Button onClick={handlePause} size="lg" className="w-full" variant="outline">
                    <Pause className="mr-2" />
                    Pausar
                </Button>
            );
        case 'paused':
            return (
                <Button onClick={handleResume} size="lg" className="w-full">
                    <Play className="mr-2" />
                    Reanudar
                </Button>
            );
    }
  }


  return (
    <div>
      <Popover onOpenChange={(open) => {
        if (!open) {
          handleStop();
        }
      }}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Escuchar capítulo">
            <Volume2 className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60">
          <div className="flex flex-col gap-4 items-center">
            <h4 className="font-medium leading-none">Reproductor de Audio</h4>

            <div className="w-full space-y-2">
              {getPlayButton()}
              {speechState !== 'idle' && (
                <Button onClick={handleStop} size="lg" className="w-full" variant="destructive">
                    <Square className="mr-2" />
                    Detener
                </Button>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Utiliza la función de texto a voz de tu navegador.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

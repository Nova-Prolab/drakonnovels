
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Volume2, Play, Pause, Square } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ChapterAudioPlayerProps = {
  chapterText: string;
};

type SpeechState = "idle" | "playing" | "paused";

export function ChapterAudioPlayer({ chapterText }: ChapterAudioPlayerProps) {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const cleanUpSpeech = useCallback(() => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      setSpeechState("idle");
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      cleanUpSpeech();
    };
  }, [cleanUpSpeech]);

  const handlePlay = () => {
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(chapterText);
    utterance.lang = "es-ES"; 

    utterance.onstart = () => {
      setSpeechState("playing");
    };
    utterance.onpause = () => {
      setSpeechState("paused");
    };
    utterance.onresume = () => {
      setSpeechState("playing");
    };
    utterance.onend = () => {
      setSpeechState("idle");
    };
    utterance.onerror = (event) => {
        console.error("SpeechSynthesis Error", event);
        setSpeechState("idle");
    };
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  
  const handlePause = () => {
    window.speechSynthesis.pause();
  };
  
  const handleResume = () => {
    window.speechSynthesis.resume();
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setSpeechState("idle");
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
      <Popover onOpenChange={(open) => !open && cleanUpSpeech()}>
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


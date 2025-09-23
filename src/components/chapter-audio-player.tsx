
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Square } from 'lucide-react';
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
    
    // Clean up when the component unmounts or the chapter changes
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
          description: "No se pudo reproducir el audio. Tu navegador puede no ser compatible o el texto es demasiado largo.",
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
    
    // Ensure everything is stopped before starting fresh
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    currentParagraphIndexRef.current = 0;
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

  const handleMainButtonClick = () => {
    switch(speechState) {
        case 'idle':
            handlePlay();
            break;
        case 'playing':
            handlePause();
            break;
        case 'paused':
            handleResume();
            break;
    }
  };
  
  const getIcon = () => {
    if (speechState === 'playing') {
      return <Pause className="h-5 w-5" />;
    }
    return <Play className="h-5 w-5" />;
  }

  return (
    <div className="flex items-center gap-1">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={handleMainButtonClick}
        aria-label={speechState === 'playing' ? 'Pausar audio' : 'Reproducir audio'}
      >
        {getIcon()}
      </Button>
      {speechState !== 'idle' && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleStop}
          aria-label="Detener audio"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Square className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}

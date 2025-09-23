import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ChapterAudioPlayerProps = {
  chapterText: string;
  onParagraphChange: (index: number) => void;
  onBoundary: (charIndex: number) => void;
};

type SpeechState = "idle" | "playing" | "paused";

export function ChapterAudioPlayer({ chapterText, onParagraphChange, onBoundary }: ChapterAudioPlayerProps) {
  const [speechState, setSpeechState] = useState<SpeechState>("idle");
  const paragraphsRef = useRef<string[]>([]);
  const currentParagraphIndexRef = useRef<number>(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const cleanUpSpeech = useCallback(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
       if (utteranceRef.current) {
        // Nullify all event handlers to prevent lingering events from firing
        utteranceRef.current.onstart = null;
        utteranceRef.current.onpause = null;
        utteranceRef.current.onresume = null;
        utteranceRef.current.onend = null;
        utteranceRef.current.onerror = null;
        utteranceRef.current.onboundary = null;
        utteranceRef.current = null;
      }
      if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
      }
    }
  }, []);
  
  useEffect(() => {
    paragraphsRef.current = chapterText.split('\n').filter(p => p.trim() !== '');
    
    // Clean up when the component unmounts or the chapter changes
    return () => {
      cleanUpSpeech();
      setSpeechState("idle");
      onParagraphChange(-1);
      onBoundary(-1);
      currentParagraphIndexRef.current = 0;
    };
  }, [chapterText, cleanUpSpeech, onParagraphChange, onBoundary]);

  const speakParagraph = (index: number) => {
    if (index >= paragraphsRef.current.length || typeof window === "undefined" || !window.speechSynthesis) {
      cleanUpSpeech();
      setSpeechState("idle");
      onParagraphChange(-1);
      onBoundary(-1);
      currentParagraphIndexRef.current = 0;
      return;
    }

    const paragraph = paragraphsRef.current[index];
    const utterance = new SpeechSynthesisUtterance(paragraph);
    utterance.lang = "es-ES";
    utteranceRef.current = utterance;

    utterance.onstart = () => {
        setSpeechState("playing");
        onParagraphChange(index);
    }
    utterance.onpause = () => setSpeechState("paused");
    utterance.onresume = () => setSpeechState("playing");
    utterance.onboundary = (event) => {
      onBoundary(event.charIndex);
    }
    utterance.onend = () => {
      if (currentParagraphIndexRef.current < paragraphsRef.current.length - 1) {
        currentParagraphIndexRef.current += 1;
        speakParagraph(currentParagraphIndexRef.current);
      } else {
        setSpeechState("idle");
        onParagraphChange(-1);
        onBoundary(-1);
        currentParagraphIndexRef.current = 0;
      }
    };
    utterance.onerror = (event) => {
      // Don't show toast if it's a cancellation error, which is expected
      if (event.error === 'canceled') {
        return;
      }
      console.error("SpeechSynthesis Error:", event);
      toast({
          title: "Error de Audio",
          description: "No se pudo reproducir el audio. Tu navegador puede no ser compatible o el texto es demasiado largo.",
          variant: "destructive",
      });
      cleanUpSpeech();
      setSpeechState("idle");
      onParagraphChange(-1);
      onBoundary(-1);
      currentParagraphIndexRef.current = 0;
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
    // Synchronously update the state before performing the async cleanup
    setSpeechState("idle");
    onParagraphChange(-1);
    onBoundary(-1);
    currentParagraphIndexRef.current = 0;
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

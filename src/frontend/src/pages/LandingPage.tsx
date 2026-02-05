import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Play } from 'lucide-react';
import { isDemoMode, enableDemoMode } from '../store/demoMode';
import { getDemoVideoLink, getPitchText } from '../store/adminSettings';
import { getTodaysAnchor, loadDailyAnchors } from '../store/dailyAnchorPhrases';

interface LandingPageProps {
  onStart: () => void;
  onStartDemo: () => void;
  onViewHistory: () => void;
}

export default function LandingPage({ onStart, onStartDemo, onViewHistory }: LandingPageProps) {
  const [demoVideo, setDemoVideo] = useState('');
  const [pitch, setPitch] = useState('');
  const [dailyAnchor, setDailyAnchor] = useState('');

  useEffect(() => {
    loadDailyAnchors();
    setDemoVideo(getDemoVideoLink());
    setPitch(getPitchText());
    setDailyAnchor(getTodaysAnchor());
  }, []);

  const handleStartDemo = () => {
    enableDemoMode();
    onStartDemo();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in duration-700">
        <div className="space-y-8">
          <div className="flex justify-center mb-8">
            <img 
              src="/assets/generated/onebit-logo.dim_200x200.png" 
              alt="Onebit" 
              className="w-28 h-28 opacity-90 drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extralight text-calm-deep tracking-tight leading-tight">
            Onebit — focus on one<br />important thing<br />right now
          </h1>
          
          <p className="text-xl md:text-2xl text-calm-muted font-light max-w-xl mx-auto leading-relaxed">
            {pitch || 'Let go of everything else. Just for a moment.'}
          </p>

          {dailyAnchor && (
            <p className="text-lg text-calm-deep/80 font-light italic max-w-lg mx-auto">
              {dailyAnchor}
            </p>
          )}

          {demoVideo && (
            <div className="flex justify-center">
              <a
                href={demoVideo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-calm-deep hover:text-calm-deep/80 transition-colors font-light"
              >
                <Play className="h-5 w-5" />
                Watch demo (60s)
              </a>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={onStart}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Start Onebit
          </Button>

          <Button
            onClick={handleStartDemo}
            size="lg"
            variant="outline"
            className="px-14 py-7 text-xl font-light rounded-full border-2 border-calm-deep text-calm-deep hover:bg-calm-deep/5"
          >
            Try Demo
          </Button>

          <Button
            onClick={onViewHistory}
            variant="ghost"
            size="sm"
            className="text-calm-muted hover:text-calm-deep font-light mt-2"
          >
            View History
          </Button>
        </div>
      </div>

      <footer className="absolute bottom-8 text-center text-sm text-calm-muted/60">
        © 2026. Built with love using{' '}
        <a 
          href="https://caffeine.ai" 
          target="_blank" 
          rel="noopener noreferrer"
          className="underline hover:text-calm-muted transition-colors"
        >
          caffeine.ai
        </a>
      </footer>
    </div>
  );
}

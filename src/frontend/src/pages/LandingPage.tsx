import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, History, Play } from 'lucide-react';
import { isDemoMode, enableDemoMode, disableDemoMode } from '../store/demoMode';
import { getDemoVideoLink, getPitchText } from '../store/adminSettings';

interface LandingPageProps {
  onStart: () => void;
  onViewHistory: () => void;
}

export default function LandingPage({ onStart, onViewHistory }: LandingPageProps) {
  const [demoMode, setDemoMode] = useState(false);
  const [demoVideo, setDemoVideo] = useState('');
  const [pitch, setPitch] = useState('');

  useEffect(() => {
    setDemoMode(isDemoMode());
    setDemoVideo(getDemoVideoLink());
    setPitch(getPitchText());
  }, []);

  const handleToggleDemo = () => {
    if (demoMode) {
      disableDemoMode();
      setDemoMode(false);
    } else {
      enableDemoMode();
      setDemoMode(true);
    }
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
          
          {demoMode && (
            <div className="inline-block px-4 py-2 bg-calm-deep/10 backdrop-blur-sm rounded-full text-sm text-calm-deep font-light border border-calm-deep/20">
              Demo Mode Active
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-extralight text-calm-deep tracking-tight leading-tight">
            Focus on one<br />important thing<br />right now.
          </h1>
          
          <p className="text-xl md:text-2xl text-calm-muted font-light max-w-xl mx-auto leading-relaxed">
            {pitch || 'Let go of everything else. Just for a moment.'}
          </p>

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
            Start
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={onViewHistory}
              variant="ghost"
              size="sm"
              className="text-calm-muted hover:text-calm-deep font-light"
            >
              <History className="mr-2 h-4 w-4" />
              History
            </Button>

            <Button
              onClick={handleToggleDemo}
              variant="ghost"
              size="sm"
              className="text-calm-muted hover:text-calm-deep font-light"
            >
              {demoMode ? 'Exit Demo' : 'Try Demo'}
            </Button>
          </div>
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

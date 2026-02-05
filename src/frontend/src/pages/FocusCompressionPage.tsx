import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { SessionData } from '../App';
import { focusCompress } from '../utils/deterministicFocusCompression';
import { isLLMEnabled } from '../store/adminSettings';
import { isDemoMode } from '../store/demoMode';

interface FocusCompressionPageProps {
  sessionData: SessionData;
  onNext: (compressedAction: string, fallbackAction: string | null, llmCallCount: number) => void;
}

export default function FocusCompressionPage({ sessionData, onNext }: FocusCompressionPageProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [action, setAction] = useState('');
  const [fallback, setFallback] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const compress = async () => {
      // Always use deterministic compression
      const result = focusCompress(
        sessionData.mentalDump,
        sessionData.blocker,
        sessionData.timeBucket
      );

      setAction(result.action);
      setFallback(result.fallback);

      // TODO: Optional LLM enhancement if enabled and not in demo mode
      // For now, always use deterministic result
      const llmCallCount = 0;

      // Simulate brief processing time for UX
      await new Promise(resolve => setTimeout(resolve, 800));
      setIsProcessing(false);
    };

    compress();
  }, [sessionData]);

  const handleAccept = () => {
    onNext(action, fallback, 0);
  };

  const handleUseFallback = () => {
    if (fallback) {
      onNext(fallback, action, 0);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center space-y-10 animate-in fade-in duration-500">
          <Loader2 className="h-16 w-16 animate-spin text-calm-deep mx-auto" />
          <p className="text-2xl md:text-3xl font-light text-calm-muted">
            Choosing your one thing...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-12 animate-in fade-in duration-700">
        <div className="space-y-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-calm-deep/10 backdrop-blur-sm mb-4">
            <Sparkles className="h-10 w-10 text-calm-deep" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extralight text-calm-deep tracking-tight">
            Your one thing:
          </h2>
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 md:p-14 shadow-2xl border-2 border-calm-deep/20">
            <p className="text-2xl md:text-4xl font-light text-calm-deep leading-relaxed">
              {action}
            </p>
          </div>

          {fallback && (
            <div className="pt-4">
              <Button
                onClick={() => setShowFallback(!showFallback)}
                variant="ghost"
                size="sm"
                className="text-calm-muted hover:text-calm-deep font-light"
              >
                {showFallback ? 'Hide alternative' : 'Show alternative'}
              </Button>
              
              {showFallback && (
                <div className="mt-4 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-calm-border/50">
                  <p className="text-lg font-light text-calm-muted mb-3">
                    Alternative:
                  </p>
                  <p className="text-xl font-light text-calm-deep">
                    {fallback}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={handleAccept}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Let's do this
          </Button>

          {fallback && showFallback && (
            <Button
              onClick={handleUseFallback}
              variant="ghost"
              size="sm"
              className="text-calm-muted hover:text-calm-deep font-light"
            >
              Use alternative instead
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

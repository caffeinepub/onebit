import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight } from 'lucide-react';
import { SessionData } from '../App';
import { focusCompress } from '../utils/deterministicFocusCompression';

interface FocusCompressionPageProps {
  sessionData: SessionData;
  onNext: (compressedAction: string, fallbackAction: string | null, rationale: string) => void;
}

export default function FocusCompressionPage({ sessionData, onNext }: FocusCompressionPageProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [result, setResult] = useState<{ action: string; fallback: string | null; rationale: string } | null>(null);

  useEffect(() => {
    const process = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const compressed = focusCompress(
        sessionData.mentalDump,
        sessionData.blocker,
        sessionData.timeBucket
      );
      
      setResult(compressed);
      setIsProcessing(false);
    };

    process();
  }, [sessionData]);

  const handleContinue = () => {
    if (result) {
      onNext(result.action, result.fallback, result.rationale);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in duration-500">
        {isProcessing ? (
          <div className="text-center space-y-8">
            <Loader2 className="h-16 w-16 animate-spin text-calm-deep mx-auto" />
            <p className="text-2xl font-light text-calm-deep">
              Finding your one thing...
            </p>
          </div>
        ) : result ? (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-light text-calm-muted">
                Your one thing right now
              </h2>
              <p className="text-4xl md:text-5xl font-light text-calm-deep leading-tight">
                {result.action}
              </p>
              <p className="text-lg text-calm-muted font-light italic">
                {result.rationale}
              </p>
            </div>

            {result.fallback && (
              <div className="p-6 bg-white/60 backdrop-blur-sm rounded-2xl border border-calm-border/30">
                <p className="text-sm text-calm-muted font-light mb-2">Alternative:</p>
                <p className="text-lg text-calm-deep font-light">
                  {result.fallback}
                </p>
              </div>
            )}

            <div className="flex justify-center pt-6">
              <Button
                onClick={handleContinue}
                size="lg"
                className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                Continue
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowRight, X } from 'lucide-react';
import { SessionData } from '../App';
import { recoveryFor } from '../utils/deterministicRecovery';

interface RecoveryPageProps {
  sessionData: SessionData;
  onRecoveryGenerated: (message: string, microSteps: string[], llmCallCount: number) => void;
  onContinue: () => void;
  onEndSession: () => void;
}

export default function RecoveryPage({ 
  sessionData, 
  onRecoveryGenerated,
  onContinue, 
  onEndSession 
}: RecoveryPageProps) {
  const [isProcessing, setIsProcessing] = useState(true);
  const [recovery, setRecovery] = useState<{ message: string; microSteps: string[] }>({
    message: '',
    microSteps: [],
  });

  useEffect(() => {
    const generateRecovery = async () => {
      // Always use deterministic recovery
      const result = recoveryFor(sessionData.outcome, sessionData.compressedAction);

      setRecovery({
        message: result.message,
        microSteps: result.microSteps || [],
      });

      onRecoveryGenerated(result.message, result.microSteps || [], 0);

      // Simulate brief processing time for UX
      await new Promise(resolve => setTimeout(resolve, 600));
      setIsProcessing(false);
    };

    generateRecovery();
  }, [sessionData]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center space-y-10 animate-in fade-in duration-500">
          <Loader2 className="h-16 w-16 animate-spin text-calm-deep mx-auto" />
          <p className="text-2xl md:text-3xl font-light text-calm-muted">
            Finding a smaller step...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in duration-700">
        <div className="space-y-8 text-center">
          <h2 className="text-3xl md:text-4xl font-light text-calm-deep leading-relaxed">
            {recovery.message}
          </h2>

          {recovery.microSteps.length > 0 && (
            <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-xl border-2 border-calm-border/30 text-left">
              <ul className="space-y-4">
                {recovery.microSteps.map((step, index) => (
                  <li key={index} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-calm-deep/10 flex items-center justify-center text-calm-deep font-light">
                      {index + 1}
                    </span>
                    <span className="text-xl font-light text-calm-deep pt-1">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-3">
          {recovery.microSteps.length > 0 && (
            <Button
              onClick={onContinue}
              size="lg"
              className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              I'll try this
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          )}

          <Button
            onClick={onEndSession}
            variant="ghost"
            size="lg"
            className="px-10 py-6 text-lg font-light rounded-full text-calm-muted hover:text-calm-deep hover:bg-white/50"
          >
            <X className="mr-2 h-5 w-5" />
            End session
          </Button>
        </div>
      </div>
    </div>
  );
}

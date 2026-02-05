import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';
import { SessionData } from '../App';
import { recoveryFor } from '../utils/deterministicRecovery';

interface RecoveryPageProps {
  sessionData: SessionData;
  onRecoveryGenerated: (message: string, microSteps: string[]) => void;
  onContinue: () => void;
  onStartNew: () => void;
  onEndSession: () => void;
}

export default function RecoveryPage({
  sessionData,
  onRecoveryGenerated,
  onContinue,
  onStartNew,
  onEndSession,
}: RecoveryPageProps) {
  useEffect(() => {
    const recovery = recoveryFor(sessionData.outcome, sessionData.compressedAction);
    onRecoveryGenerated(recovery.message, recovery.microSteps);
  }, [sessionData.outcome, sessionData.compressedAction, onRecoveryGenerated]);

  const recovery = recoveryFor(sessionData.outcome, sessionData.compressedAction);

  if (sessionData.outcome === 'done') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in duration-500">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-light text-calm-deep">
              {recovery.message}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <Button
              onClick={onStartNew}
              size="lg"
              className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="mr-3 h-6 w-6" />
              Start new Onebit
            </Button>

            <Button
              onClick={onEndSession}
              variant="outline"
              size="lg"
              className="px-14 py-7 text-xl font-light rounded-full border-2 border-calm-deep text-calm-deep hover:bg-calm-deep/5"
            >
              End session
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-light text-calm-deep">
            {recovery.message}
          </h2>
        </div>

        {recovery.microSteps.length > 0 && (
          <div className="space-y-4">
            {recovery.microSteps.map((step, index) => (
              <div
                key={index}
                className="p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-calm-border/30"
              >
                <p className="text-xl font-light text-calm-deep">
                  {step}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center pt-6">
          <Button
            onClick={onContinue}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            Try again
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

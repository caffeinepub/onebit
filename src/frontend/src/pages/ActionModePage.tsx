import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, CheckCircle2 } from 'lucide-react';
import { SessionData } from '../App';
import { useCountdownTimer } from '../hooks/useCountdownTimer';

interface ActionModePageProps {
  sessionData: SessionData;
  onCheckIn: () => void;
}

export default function ActionModePage({ sessionData, onCheckIn }: ActionModePageProps) {
  const timer = useCountdownTimer(sessionData.timeBucket);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-14 animate-in fade-in duration-700">
        <div className="space-y-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extralight text-calm-deep tracking-tight">
            Your focus:
          </h2>
          
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 md:p-14 shadow-2xl border-2 border-calm-deep/20">
            <p className="text-2xl md:text-4xl font-light text-calm-deep leading-relaxed">
              {sessionData.compressedAction}
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-6xl md:text-7xl font-extralight text-calm-deep tracking-tight">
              {timer.formatTime()}
            </div>

            <div className="flex justify-center gap-3">
              {!timer.isRunning ? (
                <Button
                  onClick={timer.start}
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-full border-2 border-calm-border hover:border-calm-deep hover:bg-calm-deep/5"
                >
                  <Play className="h-5 w-5" />
                </Button>
              ) : (
                <Button
                  onClick={timer.pause}
                  variant="outline"
                  size="lg"
                  className="px-8 py-6 rounded-full border-2 border-calm-border hover:border-calm-deep hover:bg-calm-deep/5"
                >
                  <Pause className="h-5 w-5" />
                </Button>
              )}

              <Button
                onClick={timer.reset}
                variant="outline"
                size="lg"
                className="px-8 py-6 rounded-full border-2 border-calm-border hover:border-calm-deep hover:bg-calm-deep/5"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {timer.isComplete && (
            <p className="text-lg text-calm-muted font-light">
              Time's up! How did it go?
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onCheckIn}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <CheckCircle2 className="mr-3 h-6 w-6" />
            Check in
          </Button>
        </div>
      </div>
    </div>
  );
}

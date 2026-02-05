import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2 } from 'lucide-react';
import { SessionData } from '../App';
import { useCountdownTimer } from '../hooks/useCountdownTimer';

interface ActionModePageProps {
  sessionData: SessionData;
  onCheckIn: (quickNote: string, timeSpent: number) => void;
}

export default function ActionModePage({ sessionData, onCheckIn }: ActionModePageProps) {
  const timer = useCountdownTimer(sessionData.timeBucket);
  const [quickNote, setQuickNote] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const handleWorkingClick = () => {
    if (!isWorking) {
      timer.start();
      setIsWorking(true);
    }
  };

  const handleCheckIn = () => {
    const timeSpent = Math.floor((sessionData.timeBucket * 60 - timer.timeRemaining) / 60);
    onCheckIn(quickNote, timeSpent);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-14 animate-in fade-in duration-700">
        <div className="space-y-10 text-center">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-10 md:p-14 shadow-2xl border-2 border-calm-deep/20">
            <p className="text-2xl md:text-4xl font-light text-calm-deep leading-relaxed">
              {sessionData.compressedAction}
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-6xl md:text-7xl font-extralight text-calm-deep tracking-tight">
              {timer.formatTime()}
            </div>

            {!isWorking && (
              <Button
                onClick={handleWorkingClick}
                size="lg"
                className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                I'm working on it
              </Button>
            )}

            {isWorking && (
              <p className="text-lg text-calm-muted font-light">
                Timer running...
              </p>
            )}
          </div>

          {timer.isComplete && (
            <p className="text-lg text-calm-muted font-light">
              Time's up! How did it go?
            </p>
          )}

          <div className="max-w-md mx-auto space-y-3 text-left">
            <Label htmlFor="quick-note" className="text-sm text-calm-muted font-light">
              Quick note (optional)
            </Label>
            <Input
              id="quick-note"
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Any thoughts..."
              className="bg-white/70 backdrop-blur-sm border border-calm-border/50 focus:border-calm-deep rounded-xl font-light"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleCheckIn}
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

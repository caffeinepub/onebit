import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, History } from 'lucide-react';
import { SessionData } from '../App';
import { saveCompletedSession } from '../store/sessionStore';
import { toast } from 'sonner';

interface SessionEndPageProps {
  sessionData: SessionData;
  onViewHistory: () => void;
  onStartNew: () => void;
}

export default function SessionEndPage({ sessionData, onViewHistory, onStartNew }: SessionEndPageProps) {
  useEffect(() => {
    const finalSession = {
      ...sessionData,
      timestamp: Date.now(),
    };
    saveCompletedSession(finalSession);
    toast.success('Session saved');
  }, [sessionData]);

  const formatOutcome = (outcome: string) => {
    const map: Record<string, string> = {
      done: 'Completed',
      stuck: 'Got stuck',
      avoided: 'Avoided',
    };
    return map[outcome] || outcome;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-light text-calm-deep">
            Session complete
          </h2>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-calm-border/30 space-y-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-calm-muted font-light mb-1">Task</p>
              <p className="text-xl font-light text-calm-deep">
                {sessionData.compressedAction}
              </p>
            </div>

            <div className="flex gap-8">
              <div>
                <p className="text-sm text-calm-muted font-light mb-1">Time spent</p>
                <p className="text-lg font-light text-calm-deep">
                  {formatTime(sessionData.timeSpent)}
                </p>
              </div>

              <div>
                <p className="text-sm text-calm-muted font-light mb-1">Outcome</p>
                <p className="text-lg font-light text-calm-deep">
                  {formatOutcome(sessionData.outcome)}
                </p>
              </div>
            </div>

            {sessionData.quickNote && (
              <div>
                <p className="text-sm text-calm-muted font-light mb-1">Note</p>
                <p className="text-base font-light text-calm-deep italic">
                  "{sessionData.quickNote}"
                </p>
              </div>
            )}
          </div>
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
            onClick={onViewHistory}
            variant="outline"
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full border-2 border-calm-deep text-calm-deep hover:bg-calm-deep/5"
          >
            <History className="mr-3 h-6 w-6" />
            View History
          </Button>
        </div>
      </div>
    </div>
  );
}

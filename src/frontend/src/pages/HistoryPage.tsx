import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Download } from 'lucide-react';
import { loadSessions, StoredSession } from '../store/sessionStore';
import { DEMO_SESSIONS } from '../demo/demoSessions';
import { isDemoMode } from '../store/demoMode';
import { exportSessionsToTxt } from '../utils/exportSessionsTxt';
import { computeHabitMemory } from '../utils/habitMemory';
import { getReflectionForDate, shouldShowReflectionPrompt, loadReflections } from '../store/reflectionsStore';
import ReflectionPromptDialog from '../components/ReflectionPromptDialog';

interface HistoryPageProps {
  onStartNew: () => void;
}

export default function HistoryPage({ onStartNew }: HistoryPageProps) {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [demoMode, setDemoMode] = useState(false);
  const [habitDays, setHabitDays] = useState(0);
  const [showReflection, setShowReflection] = useState(false);

  useEffect(() => {
    const demo = isDemoMode();
    setDemoMode(demo);
    
    loadReflections();
    
    if (demo) {
      setSessions(DEMO_SESSIONS);
      setHabitDays(3);
    } else {
      const loadedSessions = loadSessions();
      setSessions(loadedSessions);
      setHabitDays(computeHabitMemory(loadedSessions));
      
      if (shouldShowReflectionPrompt() && loadedSessions.length > 0) {
        setShowReflection(true);
      }
    }
  }, []);

  const handleExport = () => {
    exportSessionsToTxt(sessions);
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDateKey = (timestamp: number): string => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const formatOutcome = (outcome: string) => {
    const map: Record<string, string> = {
      done: 'Completed',
      stuck: 'Got stuck',
      avoided: 'Avoided',
    };
    return map[outcome] || outcome;
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-10 animate-in fade-in duration-500">
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extralight text-calm-deep tracking-tight">
            Session History
          </h1>
          
          {demoMode && (
            <div className="inline-block px-4 py-2 bg-calm-deep/10 backdrop-blur-sm rounded-full text-sm text-calm-deep font-light border border-calm-deep/20">
              Demo Mode - Showing sample sessions
            </div>
          )}

          {!demoMode && sessions.length > 0 && (
            <p className="text-lg text-calm-muted font-light">
              You used Onebit on {habitDays} of the last 14 days
            </p>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <p className="text-xl text-calm-muted font-light">
              No sessions yet. Start your first Onebit!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {sessions.map((session) => {
                const dateKey = getDateKey(session.timestamp);
                const reflection = getReflectionForDate(dateKey);
                
                return (
                  <div key={session.id} className="space-y-2">
                    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-calm-border/30 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <p className="text-xl font-light text-calm-deep">
                            {session.compressedAction}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-calm-muted font-light">
                            <span>{formatTimestamp(session.timestamp)}</span>
                            <span>•</span>
                            <span>{formatOutcome(session.outcome)}</span>
                          </div>
                        </div>
                      </div>

                      {session.quickNote && (
                        <div className="pt-2">
                          <p className="text-sm text-calm-deep font-light italic">"{session.quickNote}"</p>
                        </div>
                      )}

                      {session.recoveryMicroSteps.length > 0 && (
                        <div className="pt-3 border-t border-calm-border/30">
                          <p className="text-sm text-calm-muted font-light mb-2">Recovery steps:</p>
                          <ul className="space-y-1">
                            {session.recoveryMicroSteps.map((step, i) => (
                              <li key={i} className="text-sm text-calm-deep font-light pl-4">
                                • {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {reflection && (
                      <div className="bg-calm-lavender/10 backdrop-blur-md rounded-xl p-4 border border-calm-lavender/30">
                        <p className="text-xs text-calm-muted font-light mb-1">Reflection</p>
                        <p className="text-sm text-calm-deep font-light italic">"{reflection}"</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleExport}
                variant="outline"
                size="lg"
                className="px-10 py-6 text-lg font-light rounded-full border-2 border-calm-border hover:border-calm-deep hover:bg-calm-deep/5"
              >
                <Download className="mr-3 h-5 w-5" />
                Export as .txt
              </Button>
            </div>
          </>
        )}

        <div className="flex justify-center pt-6">
          <Button
            onClick={onStartNew}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Start new Onebit
          </Button>
        </div>
      </div>

      <ReflectionPromptDialog 
        open={showReflection} 
        onOpenChange={setShowReflection}
      />
    </div>
  );
}

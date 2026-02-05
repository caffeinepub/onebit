import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Sparkles, Download, ArrowLeft } from 'lucide-react';
import { loadSessions, StoredSession } from '../store/sessionStore';
import { DEMO_SESSIONS } from '../demo/demoSessions';
import { isDemoMode } from '../store/demoMode';
import { isSyncEnabled, enableSync, disableSync } from '../store/syncSettings';
import { exportSessionsToTxt } from '../utils/exportSessionsTxt';

interface HistoryPageProps {
  onStartNew: () => void;
}

export default function HistoryPage({ onStartNew }: HistoryPageProps) {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    const demo = isDemoMode();
    setDemoMode(demo);
    
    if (demo) {
      setSessions(DEMO_SESSIONS);
    } else {
      setSessions(loadSessions());
    }

    setSyncEnabled(isSyncEnabled());
  }, []);

  const handleToggleSync = (checked: boolean) => {
    if (checked) {
      enableSync();
    } else {
      disableSync();
    }
    setSyncEnabled(checked);
  };

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
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        </div>

        {!demoMode && (
          <div className="flex items-center justify-between p-6 bg-white/70 backdrop-blur-sm rounded-2xl border border-calm-border/50">
            <div className="space-y-1">
              <Label htmlFor="sync-toggle" className="text-base font-light text-calm-deep">
                Backend Sync
              </Label>
              <p className="text-sm text-calm-muted font-light">
                {syncEnabled ? 'Sessions are synced to backend' : 'Local storage only'}
              </p>
            </div>
            <Switch
              id="sync-toggle"
              checked={syncEnabled}
              onCheckedChange={handleToggleSync}
            />
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <p className="text-xl text-calm-muted font-light">
              No sessions yet. Start your first Onebit!
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-calm-border/30 space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <p className="text-xl font-light text-calm-deep">
                        {session.compressedAction}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-calm-muted font-light">
                        <span>{formatTimestamp(session.timestamp)}</span>
                        <span>•</span>
                        <span>{session.timeBucket} min</span>
                        <span>•</span>
                        <span>{formatOutcome(session.outcome)}</span>
                      </div>
                    </div>
                  </div>

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
              ))}
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
    </div>
  );
}

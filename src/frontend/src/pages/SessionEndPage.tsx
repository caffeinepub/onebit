import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { SessionData } from '../App';
import { saveCompletedSession, clearDraft } from '../store/sessionStore';

interface SessionEndPageProps {
  sessionData: SessionData;
  onViewHistory: () => void;
}

export default function SessionEndPage({ sessionData, onViewHistory }: SessionEndPageProps) {
  useEffect(() => {
    // Save completed session to local storage
    const completedSession = {
      ...sessionData,
      timestamp: Date.now(),
    };
    saveCompletedSession(completedSession);
    clearDraft();
  }, [sessionData]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-14 animate-in fade-in duration-700">
        <div className="space-y-10 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100/80 backdrop-blur-sm mb-4">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-extralight text-calm-deep tracking-tight">
            Session complete
          </h2>
          
          <p className="text-xl md:text-2xl text-calm-muted font-light max-w-xl mx-auto leading-relaxed">
            You showed up. That's what matters.
          </p>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onViewHistory}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            View history
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}

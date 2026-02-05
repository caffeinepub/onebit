import { useState, useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from './pages/LandingPage';
import MentalDumpPage from './pages/MentalDumpPage';
import ContextPage from './pages/ContextPage';
import FocusCompressionPage from './pages/FocusCompressionPage';
import ActionModePage from './pages/ActionModePage';
import CheckInPage from './pages/CheckInPage';
import RecoveryPage from './pages/RecoveryPage';
import SessionEndPage from './pages/SessionEndPage';
import HistoryPage from './pages/HistoryPage';
import AdminSettingsDialog from './components/AdminSettingsDialog';
import { loadDemoMode } from './store/demoMode';
import { loadSyncSettings } from './store/syncSettings';
import { loadAdminSettings } from './store/adminSettings';

export type FlowStep = 
  | 'landing' 
  | 'mental-dump' 
  | 'context' 
  | 'focus-compression'
  | 'action' 
  | 'check-in' 
  | 'recovery' 
  | 'session-end'
  | 'history';

export type Blocker = 'too_many' | 'low_energy' | 'avoiding' | 'urgent';
export type TimeBucket = 10 | 20 | 30;
export type Outcome = 'done' | 'stuck' | 'avoided' | '';

export interface SessionData {
  mentalDump: string;
  blocker: Blocker;
  timeBucket: TimeBucket;
  compressedAction: string;
  fallbackAction: string | null;
  outcome: Outcome;
  recoveryMessage: string;
  recoveryMicroSteps: string[];
  llmCallCount: number;
  timestamp: number;
}

function App() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('landing');
  const [sessionData, setSessionData] = useState<SessionData>({
    mentalDump: '',
    blocker: 'too_many',
    timeBucket: 10,
    compressedAction: '',
    fallbackAction: null,
    outcome: '',
    recoveryMessage: '',
    recoveryMicroSteps: [],
    llmCallCount: 0,
    timestamp: 0,
  });

  // Initialize stores on mount
  useEffect(() => {
    loadDemoMode();
    loadSyncSettings();
    loadAdminSettings();
  }, []);

  const updateSessionData = (data: Partial<SessionData>) => {
    setSessionData(prev => ({ ...prev, ...data }));
  };

  const resetSession = () => {
    setCurrentStep('landing');
    setSessionData({
      mentalDump: '',
      blocker: 'too_many',
      timeBucket: 10,
      compressedAction: '',
      fallbackAction: null,
      outcome: '',
      recoveryMessage: '',
      recoveryMicroSteps: [],
      llmCallCount: 0,
      timestamp: 0,
    });
  };

  const handleRecoveryContinue = () => {
    setCurrentStep('check-in');
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: 'url(/assets/generated/calm-gradient-bg.dim_1920x1080.png)' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-calm-sky/30 via-calm-lavender/20 to-calm-peach/30" />
        
        <div className="relative z-10">
          {currentStep === 'landing' && (
            <LandingPage 
              onStart={() => setCurrentStep('mental-dump')}
              onViewHistory={() => setCurrentStep('history')}
            />
          )}
          
          {currentStep === 'mental-dump' && (
            <MentalDumpPage
              onNext={(mentalDump) => {
                updateSessionData({ mentalDump });
                setCurrentStep('context');
              }}
              onBack={() => setCurrentStep('landing')}
            />
          )}
          
          {currentStep === 'context' && (
            <ContextPage
              onNext={(blocker, timeBucket) => {
                updateSessionData({ blocker, timeBucket });
                setCurrentStep('focus-compression');
              }}
              onBack={() => setCurrentStep('mental-dump')}
            />
          )}

          {currentStep === 'focus-compression' && (
            <FocusCompressionPage
              sessionData={sessionData}
              onNext={(compressedAction, fallbackAction, llmCallCount) => {
                updateSessionData({ compressedAction, fallbackAction, llmCallCount });
                setCurrentStep('action');
              }}
            />
          )}
          
          {currentStep === 'action' && (
            <ActionModePage
              sessionData={sessionData}
              onCheckIn={() => setCurrentStep('check-in')}
            />
          )}
          
          {currentStep === 'check-in' && (
            <CheckInPage
              onOutcome={(outcome) => {
                updateSessionData({ outcome });
                if (outcome === 'done') {
                  setCurrentStep('session-end');
                } else {
                  setCurrentStep('recovery');
                }
              }}
            />
          )}
          
          {currentStep === 'recovery' && (
            <RecoveryPage
              sessionData={sessionData}
              onRecoveryGenerated={(recoveryMessage, recoveryMicroSteps, llmCallCount) => {
                updateSessionData({ recoveryMessage, recoveryMicroSteps, llmCallCount });
              }}
              onContinue={handleRecoveryContinue}
              onEndSession={() => setCurrentStep('session-end')}
            />
          )}
          
          {currentStep === 'session-end' && (
            <SessionEndPage
              sessionData={sessionData}
              onViewHistory={() => setCurrentStep('history')}
            />
          )}

          {currentStep === 'history' && (
            <HistoryPage
              onStartNew={resetSession}
            />
          )}
        </div>
        
        <AdminSettingsDialog />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;

import { useState, useEffect, useRef } from 'react';

interface TimerState {
  timeRemaining: number;
  isRunning: boolean;
  isComplete: boolean;
}

export function useCountdownTimer(initialMinutes: number) {
  const [state, setState] = useState<TimerState>({
    timeRemaining: initialMinutes * 60,
    isRunning: false,
    isComplete: false,
  });

  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (state.isRunning && state.timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setState(prev => {
          const newTime = prev.timeRemaining - 1;
          if (newTime <= 0) {
            return { timeRemaining: 0, isRunning: false, isComplete: true };
          }
          return { ...prev, timeRemaining: newTime };
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isRunning, state.timeRemaining]);

  const start = () => {
    setState(prev => ({ ...prev, isRunning: true }));
  };

  const pause = () => {
    setState(prev => ({ ...prev, isRunning: false }));
  };

  const reset = () => {
    setState({
      timeRemaining: initialMinutes * 60,
      isRunning: false,
      isComplete: false,
    });
  };

  const formatTime = (): string => {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    timeRemaining: state.timeRemaining,
    isRunning: state.isRunning,
    isComplete: state.isComplete,
    formatTime,
    start,
    pause,
    reset,
  };
}

import { StoredSession } from '../store/sessionStore';

function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBlocker(blocker: string): string {
  const blockerMap: Record<string, string> = {
    too_many: 'Too many things',
    low_energy: 'Low energy',
    avoiding: 'Avoiding something',
    urgent: 'Urgent event',
  };
  return blockerMap[blocker] || blocker;
}

function formatOutcome(outcome: string): string {
  const outcomeMap: Record<string, string> = {
    done: 'I did it',
    stuck: 'I got stuck',
    avoided: 'I avoided it',
  };
  return outcomeMap[outcome] || outcome;
}

export function exportSessionsToTxt(sessions: StoredSession[]): void {
  if (sessions.length === 0) {
    return;
  }

  let content = 'ONEBIT SESSION HISTORY\n';
  content += '='.repeat(50) + '\n\n';

  sessions.forEach((session, index) => {
    content += `Session ${index + 1}\n`;
    content += '-'.repeat(50) + '\n';
    content += `Date: ${formatTimestamp(session.timestamp)}\n\n`;
    
    if (session.mentalDump) {
      content += `Mental Dump:\n${session.mentalDump}\n\n`;
    }
    
    content += `Blocker: ${formatBlocker(session.blocker)}\n`;
    content += `Time Bucket: ${session.timeBucket} minutes\n\n`;
    
    content += `Chosen Action: ${session.compressedAction}\n`;
    
    if (session.fallbackAction) {
      content += `Fallback Action: ${session.fallbackAction}\n`;
    }
    
    content += `\nOutcome: ${formatOutcome(session.outcome)}\n`;
    
    if (session.recoveryMicroSteps.length > 0) {
      content += `\nRecovery Steps:\n`;
      session.recoveryMicroSteps.forEach((step, i) => {
        content += `  ${i + 1}. ${step}\n`;
      });
    }
    
    content += '\n' + '='.repeat(50) + '\n\n';
  });

  // Create and download file
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `onebit-sessions-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

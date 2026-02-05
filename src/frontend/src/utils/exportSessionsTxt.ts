import { StoredSession } from '../store/sessionStore';

export function exportSessionsToTxt(sessions: StoredSession[]): void {
  if (sessions.length === 0) {
    return;
  }

  const lines: string[] = [
    'Onebit Session History',
    '======================',
    '',
  ];

  sessions.forEach((session, index) => {
    const date = new Date(session.timestamp).toLocaleString();
    const outcome = session.outcome.charAt(0).toUpperCase() + session.outcome.slice(1);
    
    lines.push(`Session ${index + 1}`);
    lines.push(`Date: ${date}`);
    lines.push(`Task: ${session.compressedAction}`);
    lines.push(`Time bucket: ${session.timeBucket} minutes`);
    lines.push(`Outcome: ${outcome}`);
    
    if (session.quickNote) {
      lines.push(`Note: ${session.quickNote}`);
    }
    
    if (session.recoveryMicroSteps.length > 0) {
      lines.push('Recovery steps:');
      session.recoveryMicroSteps.forEach((step, i) => {
        lines.push(`  ${i + 1}. ${step}`);
      });
    }
    
    lines.push('');
  });

  const content = lines.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `onebit-history-${Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

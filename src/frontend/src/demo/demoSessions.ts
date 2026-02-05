import { StoredSession } from '../store/sessionStore';

export const DEMO_SESSIONS: StoredSession[] = [
  {
    id: 'demo_1',
    mentalDump: 'Write blog post, reply to emails, call dentist, review budget',
    blocker: 'too_many',
    timeBucket: 20,
    compressedAction: 'Write blog post',
    fallbackAction: 'Reply to emails',
    outcome: 'done',
    recoveryMessage: '',
    recoveryMicroSteps: [],
    llmCallCount: 0,
    timestamp: Date.now() - 86400000, // 1 day ago
    completed: true,
  },
  {
    id: 'demo_2',
    mentalDump: 'Finish presentation slides, prepare for meeting',
    blocker: 'urgent',
    timeBucket: 30,
    compressedAction: 'Finish presentation slides',
    fallbackAction: 'Prepare for meeting',
    outcome: 'stuck',
    recoveryMessage: 'Try a smaller step:',
    recoveryMicroSteps: ['Open the file', 'Write a title'],
    llmCallCount: 0,
    timestamp: Date.now() - 172800000, // 2 days ago
    completed: true,
  },
  {
    id: 'demo_3',
    mentalDump: 'Clean desk, organize files, update task list',
    blocker: 'low_energy',
    timeBucket: 10,
    compressedAction: 'Clean desk',
    fallbackAction: 'Organize files',
    outcome: 'done',
    recoveryMessage: '',
    recoveryMicroSteps: [],
    llmCallCount: 0,
    timestamp: Date.now() - 259200000, // 3 days ago
    completed: true,
  },
];

import { StoredSession } from '../store/sessionStore';

export const DEMO_SESSIONS: StoredSession[] = [
  {
    id: 'demo_1',
    mentalDump: 'Write blog post, reply to emails, call dentist, review budget',
    blocker: 'too_many',
    timeBucket: 20,
    compressedAction: 'Write blog post',
    fallbackAction: 'Reply to emails',
    rationale: 'Picked the most actionable from your list for 20 minutes.',
    outcome: 'done',
    recoveryMessage: '',
    recoveryMicroSteps: [],
    quickNote: '',
    timeSpent: 18,
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
    rationale: 'Prioritized by urgency for 30 minutes.',
    outcome: 'stuck',
    recoveryMessage: 'Try a smaller step:',
    recoveryMicroSteps: ['Open the file', 'Write a title'],
    quickNote: 'Need more time to gather data',
    timeSpent: 15,
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
    rationale: 'Chose something achievable with low energy for 10 minutes.',
    outcome: 'done',
    recoveryMessage: '',
    recoveryMicroSteps: [],
    quickNote: 'Felt good to clear the space',
    timeSpent: 10,
    timestamp: Date.now() - 259200000, // 3 days ago
    completed: true,
  },
];

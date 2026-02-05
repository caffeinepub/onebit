import { SessionData } from '../App';

export const DEMO_FLOW_1: Partial<SessionData> = {
  mentalDump: 'Write blog post, reply to emails, call dentist, review budget',
  blocker: 'too_many',
  timeBucket: 20,
};

export const DEMO_FLOW_2: Partial<SessionData> = {
  mentalDump: 'Finish presentation slides, prepare for meeting',
  blocker: 'urgent',
  timeBucket: 30,
};

export const DEMO_FLOW_3: Partial<SessionData> = {
  mentalDump: 'Clean desk, organize files, update task list',
  blocker: 'low_energy',
  timeBucket: 10,
};

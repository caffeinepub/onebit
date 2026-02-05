export interface DemoInput {
  mentalDump: string;
  blocker: 'too_many' | 'low_energy' | 'avoiding' | 'urgent';
  timeBucket: 10 | 20 | 30;
}

export function generateDemoInputs(): DemoInput[] {
  return [
    {
      mentalDump: 'Finish project report\nReply to client emails\nPrepare presentation slides\nReview budget spreadsheet\nSchedule team meeting',
      blocker: 'too_many',
      timeBucket: 20,
    },
    {
      mentalDump: 'Write blog post draft\nUpdate portfolio website\nResearch new design trends',
      blocker: 'low_energy',
      timeBucket: 10,
    },
    {
      mentalDump: 'Call insurance company about claim\nFile taxes\nOrganize receipts',
      blocker: 'avoiding',
      timeBucket: 30,
    },
  ];
}

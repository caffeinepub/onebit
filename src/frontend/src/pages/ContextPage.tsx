import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Blocker, TimeBucket } from '../App';

interface ContextPageProps {
  onNext: (blocker: Blocker, timeBucket: TimeBucket) => void;
  onBack: () => void;
}

const blockerOptions: { value: Blocker; label: string }[] = [
  { value: 'too_many', label: 'Too many things at once' },
  { value: 'low_energy', label: 'Low energy or motivation' },
  { value: 'avoiding', label: 'Avoiding something' },
  { value: 'urgent', label: 'Urgent event or deadline' },
];

const timeOptions: { value: TimeBucket; label: string }[] = [
  { value: 10, label: '10 minutes' },
  { value: 20, label: '20 minutes' },
  { value: 30, label: '30 minutes' },
];

export default function ContextPage({ onNext, onBack }: ContextPageProps) {
  const [blocker, setBlocker] = useState<Blocker>('too_many');
  const [timeBucket, setTimeBucket] = useState<TimeBucket>(10);

  const handleNext = () => {
    onNext(blocker, timeBucket);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-14 animate-in fade-in duration-500">
        <div className="space-y-12">
          <div className="space-y-7">
            <h2 className="text-3xl md:text-5xl font-extralight text-calm-deep tracking-tight text-center leading-tight">
              What's making it hard right now?
            </h2>
            
            <RadioGroup value={blocker} onValueChange={(v) => setBlocker(v as Blocker)}>
              <div className="space-y-3">
                {blockerOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex items-center space-x-4 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      blocker === option.value
                        ? 'border-calm-deep bg-calm-deep/10 shadow-md'
                        : 'border-calm-border/50 bg-white/70 hover:bg-white/90 hover:border-calm-border'
                    }`}
                    onClick={() => setBlocker(option.value)}
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="text-lg font-light text-calm-deep cursor-pointer flex-1"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-7">
            <h2 className="text-3xl md:text-5xl font-extralight text-calm-deep tracking-tight text-center leading-tight">
              How much time can you give right now?
            </h2>
            
            <RadioGroup value={String(timeBucket)} onValueChange={(v) => setTimeBucket(Number(v) as TimeBucket)}>
              <div className="grid grid-cols-3 gap-3">
                {timeOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`flex flex-col items-center justify-center space-y-2 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
                      timeBucket === option.value
                        ? 'border-calm-deep bg-calm-deep/10 shadow-md'
                        : 'border-calm-border/50 bg-white/70 hover:bg-white/90 hover:border-calm-border'
                    }`}
                    onClick={() => setTimeBucket(option.value)}
                  >
                    <RadioGroupItem value={String(option.value)} id={String(option.value)} />
                    <Label
                      htmlFor={String(option.value)}
                      className="text-lg font-light text-calm-deep cursor-pointer text-center"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="lg"
            className="px-10 py-7 text-lg font-light rounded-full text-calm-muted hover:text-calm-deep hover:bg-white/50"
          >
            <ArrowLeft className="mr-3 h-5 w-5" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            size="lg"
            className="px-12 py-7 text-lg font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Continue
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

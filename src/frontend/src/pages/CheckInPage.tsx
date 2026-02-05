import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Outcome } from '../App';

interface CheckInPageProps {
  onOutcome: (outcome: Outcome) => void;
}

export default function CheckInPage({ onOutcome }: CheckInPageProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-14 animate-in fade-in duration-500">
        <div className="space-y-8 text-center">
          <h2 className="text-3xl md:text-5xl font-extralight text-calm-deep tracking-tight leading-tight">
            How did it go?
          </h2>
          
          <p className="text-lg text-calm-muted font-light max-w-xl mx-auto">
            Be honest. There's no judgment here.
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => onOutcome('done')}
            size="lg"
            className="w-full px-10 py-8 text-xl font-light rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CheckCircle2 className="mr-3 h-6 w-6" />
            I did it
          </Button>

          <Button
            onClick={() => onOutcome('stuck')}
            size="lg"
            variant="outline"
            className="w-full px-10 py-8 text-xl font-light rounded-2xl border-2 border-calm-border hover:border-calm-deep hover:bg-calm-deep/5 text-calm-deep"
          >
            <AlertCircle className="mr-3 h-6 w-6" />
            I got stuck
          </Button>

          <Button
            onClick={() => onOutcome('avoided')}
            size="lg"
            variant="outline"
            className="w-full px-10 py-8 text-xl font-light rounded-2xl border-2 border-calm-border hover:border-calm-deep hover:bg-calm-deep/5 text-calm-deep"
          >
            <XCircle className="mr-3 h-6 w-6" />
            I avoided it
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface MentalDumpPageProps {
  onNext: (mentalDump: string) => void;
  onBack: () => void;
}

export default function MentalDumpPage({ onNext, onBack }: MentalDumpPageProps) {
  const [mentalDump, setMentalDump] = useState('');

  const handleNext = () => {
    onNext(mentalDump);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-2xl w-full space-y-12 animate-in fade-in duration-500">
        <div className="space-y-8">
          <h2 className="text-3xl md:text-5xl font-extralight text-calm-deep tracking-tight text-center leading-tight">
            What's pulling your<br />attention right now?
          </h2>
          
          <p className="text-lg text-calm-muted font-light text-center max-w-xl mx-auto">
            List everything on your mind. One line per item, or separate with commas.
          </p>

          <Textarea
            value={mentalDump}
            onChange={(e) => setMentalDump(e.target.value)}
            placeholder="Write blog post, reply to emails, call dentist..."
            className="min-h-[280px] text-lg bg-white/90 backdrop-blur-md border-2 border-calm-border/50 focus:border-calm-deep rounded-2xl p-6 resize-none font-light"
          />
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
            disabled={!mentalDump.trim()}
            size="lg"
            className="px-12 py-7 text-lg font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

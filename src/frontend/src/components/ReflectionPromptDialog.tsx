import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { saveReflection, markReflectionShown } from '../store/reflectionsStore';
import { toast } from 'sonner';

interface ReflectionPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ReflectionPromptDialog({ open, onOpenChange }: ReflectionPromptDialogProps) {
  const [reflection, setReflection] = useState('');

  const handleSave = () => {
    if (reflection.trim()) {
      saveReflection(reflection.trim());
      toast.success('Reflection saved');
    }
    markReflectionShown();
    setReflection('');
    onOpenChange(false);
  };

  const handleSkip = () => {
    markReflectionShown();
    setReflection('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-calm-deep">
            End-of-day reflection
          </DialogTitle>
          <DialogDescription className="text-calm-muted">
            Optional — once per day
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-lg text-calm-deep font-light">
            What helped today?
          </p>
          
          <Textarea
            placeholder="Your thoughts..."
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            className="bg-white border-calm-border focus:border-calm-deep min-h-[120px]"
          />
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-calm-muted"
          >
            Skip
          </Button>
          <Button
            onClick={handleSave}
            className="bg-calm-deep hover:bg-calm-deep/90 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

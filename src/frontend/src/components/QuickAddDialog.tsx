import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface QuickAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (text: string) => void;
}

export default function QuickAddDialog({ open, onOpenChange, onSubmit }: QuickAddDialogProps) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (open) {
      setText('');
    }
  }, [open]);

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text.trim());
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-calm-deep">Quick Add</DialogTitle>
          <DialogDescription className="text-calm-muted font-light">
            Add a task or thought to your mental dump. Press Ctrl/Cmd + Enter to add.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something..."
            className="min-h-[120px] bg-white/90 border-calm-border/50 focus:border-calm-deep rounded-xl font-light"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="ghost"
              className="font-light"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="bg-calm-deep hover:bg-calm-deep/90 font-light"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

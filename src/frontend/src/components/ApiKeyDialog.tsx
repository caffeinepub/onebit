import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useIsCallerAdmin, useIsApiKeyConfigured, useStoreApiKey } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ApiKeyDialog() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: isConfigured, isLoading: isConfiguredLoading } = useIsApiKeyConfigured();
  const { mutateAsync: storeKey } = useStoreApiKey();

  if (isAdminLoading || !isAdmin) {
    return null;
  }

  const handleSave = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSubmitting(true);
    try {
      await storeKey(apiKey);
      toast.success('API key saved successfully');
      setApiKey('');
      setOpen(false);
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async () => {
    setIsSubmitting(true);
    try {
      await storeKey('');
      toast.success('API key cleared');
      setApiKey('');
      setOpen(false);
    } catch (error) {
      console.error('Error clearing API key:', error);
      toast.error('Failed to clear API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-md rounded-full"
        >
          <Settings className="h-5 w-5 text-calm-deep" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-calm-deep">
            OpenAI API Configuration
          </DialogTitle>
          <DialogDescription className="text-calm-muted">
            Configure the OpenAI API key for AI-powered focus task generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-calm-deep/5 border border-calm-border">
            {isConfiguredLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-calm-muted" />
            ) : isConfigured ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-600" />
            )}
            <div>
              <p className="text-sm font-medium text-calm-deep">
                {isConfiguredLoading ? 'Checking...' : isConfigured ? 'API Key Configured' : 'API Key Not Configured'}
              </p>
              <p className="text-xs text-calm-muted">
                {isConfigured 
                  ? 'AI features are enabled' 
                  : 'AI features will use fallback suggestions'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="apiKey" className="text-calm-deep">
              OpenAI API Key
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-proj-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="bg-white border-calm-border focus:border-calm-deep"
              disabled={isSubmitting}
            />
            <p className="text-xs text-calm-muted">
              Your API key is stored securely on the Internet Computer and never exposed to users.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {isConfigured && (
            <Button
              variant="outline"
              onClick={handleClear}
              disabled={isSubmitting}
              className="border-rose-200 text-rose-600 hover:bg-rose-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                'Clear Key'
              )}
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={isSubmitting || !apiKey.trim()}
            className="bg-calm-deep hover:bg-calm-deep/90 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Key'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

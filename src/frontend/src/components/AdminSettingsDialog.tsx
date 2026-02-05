import { useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Settings, Loader2 } from 'lucide-react';
import { useIsCallerAdmin, useStoreApiKey, useIsApiKeyConfigured } from '../hooks/useQueries';
import { toast } from 'sonner';
import {
  isLLMEnabled,
  enableLLM,
  disableLLM,
  getDemoVideoLink,
  setDemoVideoLink,
  getPitchText,
  setPitchText,
} from '../store/adminSettings';

export default function AdminSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [llmEnabled, setLlmEnabled] = useState(false);
  const [videoLink, setVideoLink] = useState('');
  const [pitch, setPitch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const { data: isConfigured, isLoading: isConfiguredLoading } = useIsApiKeyConfigured();
  const { mutateAsync: storeKey } = useStoreApiKey();

  useEffect(() => {
    if (open) {
      setLlmEnabled(isLLMEnabled());
      setVideoLink(getDemoVideoLink());
      setPitch(getPitchText());
    }
  }, [open]);

  if (isAdminLoading || !isAdmin) {
    return null;
  }

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSubmitting(true);
    try {
      await storeKey(apiKey);
      toast.success('API key saved successfully');
      setApiKey('');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearApiKey = async () => {
    setIsSubmitting(true);
    try {
      await storeKey('');
      toast.success('API key cleared');
      setApiKey('');
    } catch (error) {
      console.error('Error clearing API key:', error);
      toast.error('Failed to clear API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleLLM = (checked: boolean) => {
    if (checked) {
      enableLLM();
    } else {
      disableLLM();
    }
    setLlmEnabled(checked);
    toast.success(checked ? 'LLM enabled' : 'LLM disabled');
  };

  const handleSaveContent = () => {
    setDemoVideoLink(videoLink);
    setPitchText(pitch);
    toast.success('Landing content saved');
    setOpen(false);
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
      <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-calm-deep">
            Admin Settings
          </DialogTitle>
          <DialogDescription className="text-calm-muted">
            Configure LLM integration, API keys, and landing page content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* LLM Toggle */}
          <div className="space-y-4 p-4 rounded-lg bg-calm-deep/5 border border-calm-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="llm-toggle" className="text-base font-medium text-calm-deep">
                  Enable LLM Enhancement
                </Label>
                <p className="text-sm text-calm-muted">
                  {llmEnabled 
                    ? 'LLM will enhance focus compression and recovery (max 3 calls/session)' 
                    : 'Using deterministic logic only (default)'}
                </p>
              </div>
              <Switch
                id="llm-toggle"
                checked={llmEnabled}
                onCheckedChange={handleToggleLLM}
              />
            </div>
          </div>

          {/* API Key Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-calm-deep/5 border border-calm-border">
              {isConfiguredLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-calm-muted" />
              ) : (
                <div className={`h-3 w-3 rounded-full ${isConfigured ? 'bg-green-600' : 'bg-gray-400'}`} />
              )}
              <div>
                <p className="text-sm font-medium text-calm-deep">
                  {isConfiguredLoading ? 'Checking...' : isConfigured ? 'API Key Configured' : 'API Key Not Set'}
                </p>
                <p className="text-xs text-calm-muted">
                  {isConfigured 
                    ? 'Backend can make LLM calls when enabled' 
                    : 'App works without API key (deterministic mode)'}
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
                Key is stored backend-only and never exposed to users.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSaveApiKey}
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
              {isConfigured && (
                <Button
                  variant="outline"
                  onClick={handleClearApiKey}
                  disabled={isSubmitting}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50"
                >
                  Clear Key
                </Button>
              )}
            </div>
          </div>

          {/* Landing Page Content */}
          <div className="space-y-4 pt-4 border-t border-calm-border">
            <h3 className="text-lg font-medium text-calm-deep">Landing Page Content</h3>
            
            <div className="space-y-3">
              <Label htmlFor="videoLink" className="text-calm-deep">
                Demo Video Link (60s)
              </Label>
              <Input
                id="videoLink"
                type="url"
                placeholder="https://..."
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="bg-white border-calm-border focus:border-calm-deep"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="pitch" className="text-calm-deep">
                Pitch Text
              </Label>
              <Textarea
                id="pitch"
                placeholder="Let go of everything else. Just for a moment."
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                className="bg-white border-calm-border focus:border-calm-deep min-h-[100px]"
              />
            </div>

            <Button
              onClick={handleSaveContent}
              variant="outline"
              className="w-full"
            >
              Save Landing Content
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

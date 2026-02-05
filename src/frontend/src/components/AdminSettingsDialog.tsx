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
import { Settings, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { isDemoMode } from '../store/demoMode';
import {
  getDemoVideoLink,
  setDemoVideoLink,
  getPitchText,
  setPitchText,
} from '../store/adminSettings';
import {
  isSyncEnabled,
  enableSync,
  disableSync,
} from '../store/syncSettings';
import {
  getDailyAnchors,
  setDailyAnchors,
} from '../store/dailyAnchorPhrases';
import {
  getMicroStepLibrary,
  setMicroStepLibrary,
  MicroStepCategory,
} from '../store/microStepLibrary';

export default function AdminSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [videoLink, setVideoLink] = useState('');
  const [pitch, setPitch] = useState('');
  const [syncEnabled, setSyncEnabled] = useState(false);
  const [dailyAnchors, setDailyAnchorsState] = useState<string[]>([]);
  const [microSteps, setMicroStepsState] = useState<MicroStepCategory[]>([]);
  const [newAnchor, setNewAnchor] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newStep, setNewStep] = useState('');

  const { login, clear, identity, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();
  const demoMode = isDemoMode();

  useEffect(() => {
    if (open) {
      setVideoLink(getDemoVideoLink());
      setPitch(getPitchText());
      setSyncEnabled(isSyncEnabled());
      setDailyAnchorsState(getDailyAnchors());
      setMicroStepsState(getMicroStepLibrary());
    }
  }, [open]);

  const handleSaveContent = () => {
    setDemoVideoLink(videoLink);
    setPitchText(pitch);
    setDailyAnchors(dailyAnchors);
    setMicroStepLibrary(microSteps);
    toast.success('Settings saved');
  };

  const handleToggleSync = async (checked: boolean) => {
    if (demoMode) {
      toast.error('Sync is unavailable in demo mode');
      return;
    }

    if (checked) {
      if (!identity) {
        try {
          await login();
          enableSync();
          setSyncEnabled(true);
          toast.success('Sync enabled');
        } catch (error) {
          console.error('Login failed:', error);
          toast.error('Login required to enable sync');
        }
      } else {
        enableSync();
        setSyncEnabled(true);
        toast.success('Sync enabled');
      }
    } else {
      disableSync();
      setSyncEnabled(false);
      toast.success('Sync disabled');
    }
  };

  const handleAddAnchor = () => {
    if (newAnchor.trim()) {
      setDailyAnchorsState([...dailyAnchors, newAnchor.trim()]);
      setNewAnchor('');
    }
  };

  const handleRemoveAnchor = (index: number) => {
    setDailyAnchorsState(dailyAnchors.filter((_, i) => i !== index));
  };

  const handleAddStep = (categoryName: string) => {
    if (newStep.trim()) {
      setMicroStepsState(microSteps.map(cat => 
        cat.name === categoryName 
          ? { ...cat, steps: [...cat.steps, newStep.trim()] }
          : cat
      ));
      setNewStep('');
      setEditingCategory(null);
    }
  };

  const handleRemoveStep = (categoryName: string, stepIndex: number) => {
    setMicroStepsState(microSteps.map(cat => 
      cat.name === categoryName 
        ? { ...cat, steps: cat.steps.filter((_, i) => i !== stepIndex) }
        : cat
    ));
  };

  const handleOpenChecklist = () => {
    setOpen(false);
    navigate({ to: '/finalization-checklist' });
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
      <DialogContent className="sm:max-w-[700px] bg-white/95 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light text-calm-deep">
            Admin Settings
          </DialogTitle>
          <DialogDescription className="text-calm-muted">
            Configure landing content, daily anchors, micro-steps, and sync.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-4">
          {/* Sync Toggle */}
          <div className="space-y-4 p-4 rounded-lg bg-calm-deep/5 border border-calm-border">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="sync-toggle" className="text-base font-medium text-calm-deep">
                  Backend Sync
                </Label>
                <p className="text-sm text-calm-muted">
                  {demoMode 
                    ? 'Unavailable in demo mode' 
                    : syncEnabled 
                      ? 'Sessions sync to backend (requires sign-in)' 
                      : 'Local-first only (default)'}
                </p>
              </div>
              <Switch
                id="sync-toggle"
                checked={syncEnabled}
                onCheckedChange={handleToggleSync}
                disabled={demoMode}
              />
            </div>
          </div>

          {/* Landing Page Content */}
          <div className="space-y-4 pt-4 border-t border-calm-border">
            <h3 className="text-lg font-medium text-calm-deep">Landing Page</h3>
            
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
                className="bg-white border-calm-border focus:border-calm-deep min-h-[80px]"
              />
            </div>
          </div>

          {/* Daily Anchors */}
          <div className="space-y-4 pt-4 border-t border-calm-border">
            <h3 className="text-lg font-medium text-calm-deep">Daily Anchor Phrases</h3>
            <p className="text-sm text-calm-muted">One phrase rotates daily on the landing page.</p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {dailyAnchors.map((anchor, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-calm-deep/5 rounded">
                  <p className="flex-1 text-sm text-calm-deep">{anchor}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAnchor(index)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-rose-600" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add new anchor phrase..."
                value={newAnchor}
                onChange={(e) => setNewAnchor(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddAnchor()}
                className="bg-white border-calm-border"
              />
              <Button onClick={handleAddAnchor} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Micro-Step Library */}
          <div className="space-y-4 pt-4 border-t border-calm-border">
            <h3 className="text-lg font-medium text-calm-deep">Micro-Step Library</h3>
            <p className="text-sm text-calm-muted">Recovery shows two steps based on task type.</p>
            
            <div className="space-y-4">
              {microSteps.map((category) => (
                <div key={category.name} className="p-4 bg-calm-deep/5 rounded-lg space-y-3">
                  <h4 className="font-medium text-calm-deep">{category.name}</h4>
                  
                  <div className="space-y-2">
                    {category.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2 p-2 bg-white rounded">
                        <p className="flex-1 text-sm text-calm-deep">{step}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStep(category.name, stepIndex)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-rose-600" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {editingCategory === category.name ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="New step..."
                        value={newStep}
                        onChange={(e) => setNewStep(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddStep(category.name)}
                        className="bg-white border-calm-border"
                        autoFocus
                      />
                      <Button onClick={() => handleAddStep(category.name)} size="icon">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCategory(category.name)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add step
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Finalization Checklist Link */}
          <div className="pt-4 border-t border-calm-border">
            <Button
              onClick={handleOpenChecklist}
              variant="outline"
              className="w-full"
            >
              Open Finalization Checklist
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSaveContent} className="bg-calm-deep hover:bg-calm-deep/90 text-white">
            Save All Settings
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

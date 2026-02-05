import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';
import { loadA11ySettings, saveA11ySettings, applyA11ySettings, A11ySettings } from '../store/a11ySettings';

export default function AccessibilityControls() {
  const [settings, setSettings] = useState<A11ySettings>({ highContrast: false, largeFont: false });

  useEffect(() => {
    const loaded = loadA11ySettings();
    setSettings(loaded);
  }, []);

  const handleToggleHighContrast = (checked: boolean) => {
    const newSettings = { ...settings, highContrast: checked };
    setSettings(newSettings);
    saveA11ySettings(newSettings);
    applyA11ySettings(newSettings);
  };

  const handleToggleLargeFont = (checked: boolean) => {
    const newSettings = { ...settings, largeFont: checked };
    setSettings(newSettings);
    saveA11ySettings(newSettings);
    applyA11ySettings(newSettings);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full bg-white/90 backdrop-blur-md border-2 border-calm-border/50 hover:border-calm-deep shadow-lg"
            aria-label="Accessibility settings"
          >
            <Settings className="h-5 w-5 text-calm-deep" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 bg-white/95 backdrop-blur-md border-calm-border/50" align="end">
          <div className="space-y-4">
            <h3 className="text-lg font-light text-calm-deep">Accessibility</h3>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="high-contrast" className="text-sm font-light text-calm-deep cursor-pointer">
                High contrast
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={handleToggleHighContrast}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="large-font" className="text-sm font-light text-calm-deep cursor-pointer">
                Large font
              </Label>
              <Switch
                id="large-font"
                checked={settings.largeFont}
                onCheckedChange={handleToggleLargeFont}
              />
            </div>

            <p className="text-xs text-calm-muted font-light pt-2 border-t border-calm-border/30">
              Keyboard shortcut: Ctrl/Cmd + Shift + A for Quick Add
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

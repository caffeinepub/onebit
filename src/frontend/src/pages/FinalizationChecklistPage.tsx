import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { loadChecklistData, saveChecklistData, ChecklistData } from '../store/finalizationChecklist';
import { generateDemoInputs } from '../utils/deterministicDemoInputGenerator';
import { toast } from 'sonner';

interface FinalizationChecklistPageProps {
  onBack: () => void;
}

export default function FinalizationChecklistPage({ onBack }: FinalizationChecklistPageProps) {
  const [data, setData] = useState<ChecklistData>(loadChecklistData());

  useEffect(() => {
    const loaded = loadChecklistData();
    setData(loaded);
  }, []);

  const handleUpdate = (updates: Partial<ChecklistData>) => {
    const updated = { ...data, ...updates };
    setData(updated);
    saveChecklistData(updates);
  };

  const handleGenerateDemoInputs = () => {
    const generated = generateDemoInputs();
    const formatted = generated.map((input, i) => 
      `Demo ${i + 1}:\n${input.mentalDump}\nBlocker: ${input.blocker}\nTime: ${input.timeBucket} min`
    );
    handleUpdate({ demoInputs: formatted });
    toast.success('Demo inputs generated');
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-6 py-12">
      <div className="max-w-3xl w-full space-y-10 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-4xl md:text-5xl font-extralight text-calm-deep tracking-tight">
            Finalization Checklist
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-calm-border/30 space-y-8">
          {/* Logo */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-calm-deep">Logo</Label>
            <RadioGroup
              value={data.logoChoice}
              onValueChange={(value) => handleUpdate({ logoChoice: value as 'text' | 'svg' | '' })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="text" id="logo-text" />
                <Label htmlFor="logo-text" className="font-light">Use text logo (default)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="svg" id="logo-svg" />
                <Label htmlFor="logo-svg" className="font-light">Provide SVG logo</Label>
              </div>
            </RadioGroup>
            {data.logoChoice === 'svg' && (
              <Textarea
                placeholder="Paste SVG code here..."
                value={data.logoSvg}
                onChange={(e) => handleUpdate({ logoSvg: e.target.value })}
                className="bg-white border-calm-border min-h-[100px] font-mono text-sm"
              />
            )}
          </div>

          {/* Accent Color */}
          <div className="space-y-4">
            <Label htmlFor="accent-color" className="text-lg font-medium text-calm-deep">
              Accent Color (hex)
            </Label>
            <div className="flex gap-3 items-center">
              <Input
                id="accent-color"
                type="text"
                placeholder="#3B82F6"
                value={data.accentColor}
                onChange={(e) => handleUpdate({ accentColor: e.target.value })}
                className="bg-white border-calm-border max-w-xs"
              />
              {data.accentColor && (
                <div
                  className="w-12 h-12 rounded-lg border-2 border-calm-border"
                  style={{ backgroundColor: data.accentColor }}
                />
              )}
            </div>
          </div>

          {/* Demo Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium text-calm-deep">
                Three Demo Session Inputs
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateDemoInputs}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate
              </Button>
            </div>
            <Textarea
              placeholder="Provide three demo inputs or click Generate..."
              value={data.demoInputs.join('\n\n')}
              onChange={(e) => handleUpdate({ demoInputs: e.target.value.split('\n\n').filter(s => s.trim()) })}
              className="bg-white border-calm-border min-h-[200px]"
            />
          </div>

          {/* Background Image */}
          <div className="space-y-4">
            <Label htmlFor="bg-image" className="text-lg font-medium text-calm-deep">
              Background/Pattern Image (optional)
            </Label>
            <Input
              id="bg-image"
              type="text"
              placeholder="URL or path..."
              value={data.backgroundImage}
              onChange={(e) => handleUpdate({ backgroundImage: e.target.value })}
              className="bg-white border-calm-border"
            />
          </div>

          {/* Micro-Steps Approval */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="micro-steps"
              checked={data.microStepsApproved}
              onCheckedChange={(checked) => handleUpdate({ microStepsApproved: checked as boolean })}
            />
            <Label htmlFor="micro-steps" className="font-light text-calm-deep">
              Micro-step library reviewed and approved
            </Label>
          </div>

          {/* Daily Anchors Approval */}
          <div className="flex items-center space-x-3">
            <Checkbox
              id="daily-anchors"
              checked={data.dailyAnchorsApproved}
              onCheckedChange={(checked) => handleUpdate({ dailyAnchorsApproved: checked as boolean })}
            />
            <Label htmlFor="daily-anchors" className="font-light text-calm-deep">
              Daily anchor phrases reviewed and approved
            </Label>
          </div>

          {/* Demo Video */}
          <div className="space-y-4">
            <Label htmlFor="demo-video" className="text-lg font-medium text-calm-deep">
              Demo Video Link (60s)
            </Label>
            <Input
              id="demo-video"
              type="url"
              placeholder="https://..."
              value={data.demoVideoLink}
              onChange={(e) => handleUpdate({ demoVideoLink: e.target.value })}
              className="bg-white border-calm-border"
            />
          </div>

          {/* Pitch Text */}
          <div className="space-y-4">
            <Label htmlFor="pitch-text" className="text-lg font-medium text-calm-deep">
              Pitch Text (one paragraph)
            </Label>
            <Textarea
              id="pitch-text"
              placeholder="Let go of everything else. Just for a moment."
              value={data.pitchText}
              onChange={(e) => handleUpdate({ pitchText: e.target.value })}
              className="bg-white border-calm-border min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onBack}
            size="lg"
            className="px-14 py-7 text-xl font-light rounded-full bg-calm-deep hover:bg-calm-deep/90 text-white shadow-xl"
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

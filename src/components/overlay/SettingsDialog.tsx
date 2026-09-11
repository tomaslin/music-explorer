import React from 'react';
import { InstrumentType, Microtiming, NoteName } from '../../types';
import { X } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  
  instrument: InstrumentType;
  onInstrumentChange: (inst: InstrumentType) => void;
  profileId: string;
  onProfileChange: (profId: string) => void;
  profiles: { id: string; label: string }[];
  playableRoots: NoteName[];
  
  bpm: number;
  onBpmChange: (bpm: number) => void;
  
  currentRoot: string;
  onRootChange: (root: string) => void;
  
  displayMode: 'intervals' | 'noteNames';
  onToggleDisplayMode: () => void;
  
  feelOverride: Microtiming | 'exercise';
  onFeelChange: (feel: string) => void;
}

const ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen, onClose,
  instrument, onInstrumentChange,
  profileId, onProfileChange, profiles, playableRoots,
  bpm, onBpmChange,
  currentRoot, onRootChange,
  displayMode, onToggleDisplayMode,
  feelOverride, onFeelChange
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-800 bg-stone-950/50">
          <h2 className="text-lg font-serif font-bold text-stone-100">Playback & Display Settings</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Instrument & Tuning */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Instrument</h3>
            <div className="flex gap-2">
              {(['bass', 'guitar'] as InstrumentType[]).map(inst => (
                <button
                  key={inst}
                  onClick={() => onInstrumentChange(inst)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                    instrument === inst
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                      : 'bg-stone-950 border-stone-800 text-stone-300 hover:bg-stone-800'
                  }`}
                >
                  {inst === 'bass' ? 'Bass' : 'Guitar'}
                </button>
              ))}
            </div>
            
            {profiles.length > 1 && (
              <div className="flex flex-col gap-1.5 mt-3">
                <label className="text-xs text-stone-400">Tuning Profile</label>
                <select
                  value={profileId}
                  onChange={e => onProfileChange(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}
          </section>

          {/* Tempo & Feel */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Playback</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-stone-300">Tempo (BPM)</label>
              <div className="flex items-center gap-3">
                <input 
                  type="range" 
                  min="30" max="260" 
                  value={bpm} 
                  onChange={e => onBpmChange(Number(e.target.value))}
                  className="w-32 accent-amber-500"
                />
                <span className="text-sm font-mono font-bold w-10 text-right text-stone-100">{bpm}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-stone-400">Groove / Feel</label>
              <select
                value={feelOverride}
                onChange={e => onFeelChange(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-2 text-sm text-stone-200 focus:outline-none focus:border-amber-500/50"
              >
                <option value="exercise">Default (As written)</option>
                <option value="straight">Straight</option>
                <option value="shuffle">Blues / Shuffle</option>
                <option value="swing-light">Swing (Light)</option>
                <option value="swing-heavy">Swing (Heavy)</option>
                <option value="laid-back">Laid Back</option>
                <option value="ahead">Pushing</option>
              </select>
            </div>
          </section>

          {/* Musical Context */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500">Harmony & Display</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm text-stone-300">Root Note</label>
              <select
                value={currentRoot}
                onChange={e => onRootChange(e.target.value)}
                className="bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500/50"
              >
                {ROOTS.map(r => (
                  <option key={r} value={r} disabled={!playableRoots.includes(r as NoteName)}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex flex-col">
                <span className="text-sm text-stone-300">Fretboard Labels</span>
                <span className="text-xs text-stone-500">Scale degrees vs Notes</span>
              </div>
              <button
                onClick={onToggleDisplayMode}
                className="px-4 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-stone-200 text-sm font-medium hover:bg-stone-700 transition-colors"
              >
                {displayMode === 'intervals' ? 'Degrees (1, b3, 5)' : 'Notes (C, Eb, G)'}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

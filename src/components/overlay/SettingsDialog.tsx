import React from 'react';
import { NoteName } from '../../types';
import { X } from 'lucide-react';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  
  playableRoots: NoteName[];
  
  bpm: number;
  onBpmChange: (bpm: number) => void;
  
  currentRoot: string;
  onRootChange: (root: string) => void;
  
  displayMode: 'intervals' | 'noteNames';
  onToggleDisplayMode: () => void;
  
}

const ROOTS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen, onClose,
  playableRoots,
  bpm, onBpmChange,
  currentRoot, onRootChange,
  displayMode, onToggleDisplayMode
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
          {/* Tempo */}
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
              <span className="text-sm text-stone-300">Fretboard Labels</span>
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

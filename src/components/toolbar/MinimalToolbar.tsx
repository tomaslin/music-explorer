import React from 'react';
import { Play, Square, RotateCcw, Repeat, Volume2, VolumeX, SlidersHorizontal } from 'lucide-react';
import { InstrumentType } from '../../types';

interface MinimalToolbarProps {
  onOpenSettings: () => void;
  instrument: InstrumentType;
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  isMetronomeActive: boolean;
  onToggleMetronome: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

export const MinimalToolbar: React.FC<MinimalToolbarProps> = ({
  onOpenSettings, instrument, isPlaying, onPlayPause, onRestart,
  isLooping, onToggleLoop, isMetronomeActive, onToggleMetronome,
  bpm, onBpmChange,
}) => (
  <div className="shrink-0 border-t border-stone-800 bg-stone-950 text-stone-200 px-3 py-2 z-30">
    <div className="mx-auto max-w-[1800px] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button onClick={onRestart} title="Restart" aria-label="Restart exercise" className="p-2 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white">
          <RotateCcw className="w-4 h-4" />
        </button>
        <button onClick={onPlayPause} aria-label={isPlaying ? 'Stop exercise' : 'Play exercise'} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${isPlaying ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 hover:bg-stone-700 text-white'}`}>
          {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          {isPlaying ? 'Stop' : 'Play'}
        </button>
        <button onClick={onToggleLoop} title={isLooping ? 'Loop on' : 'Loop off'} aria-label="Toggle loop" className={`p-2 rounded-lg border ${isLooping ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'border-stone-800 text-stone-400 hover:bg-stone-800'}`}>
          <Repeat className="w-4 h-4" />
        </button>
        <button onClick={onToggleMetronome} title={isMetronomeActive ? 'Metronome on' : 'Metronome off'} aria-label="Toggle metronome" className={`p-2 rounded-lg border ${isMetronomeActive ? 'bg-amber-500/15 border-amber-500/40 text-amber-400' : 'border-stone-800 text-stone-400 hover:bg-stone-800'}`}>
          {isMetronomeActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs text-stone-400">
          <span>BPM</span>
          <input type="number" min={30} max={260} value={bpm} onChange={e => onBpmChange(Number(e.target.value) || 80)} className="w-14 text-center bg-stone-900 border border-stone-800 rounded-lg px-2 py-1.5 text-sm font-bold text-amber-300 focus:outline-none focus:border-amber-500" />
        </label>
        <span className="hidden md:inline text-[11px] text-stone-600 uppercase tracking-wider">{instrument === 'bass' ? '4-string' : '6-string'}</span>
        <button onClick={onOpenSettings} title="Playback, tuning, root and display settings" aria-label="Open settings" className="p-2 rounded-lg border border-stone-800 text-stone-400 hover:text-white hover:bg-stone-800">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);

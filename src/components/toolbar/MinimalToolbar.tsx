import React, { useMemo } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Repeat,
  Volume2,
  VolumeX,
  Info,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { ExerciseItem, InstrumentType, NoteName } from '../../types';
import { NOTE_NAMES } from '../../utils/musicTheory';

interface MinimalToolbarProps {
  onOpenSettings: () => void;
  onOpenInfo: () => void;

  instrument: InstrumentType;
  onInstrumentChange: (inst: InstrumentType) => void;

  currentRoot: NoteName;
  onRootChange: (root: string) => void;

  bpm: number;
  onBpmChange: (bpm: number) => void;

  instrumentExercises: ExerciseItem[];
  selectedExercise: ExerciseItem;
  onSelectExercise: (ex: ExerciseItem) => void;

  topLevelId: string;
  onTopLevelChange: (id: string) => void;

  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  isMetronomeActive: boolean;
  onToggleMetronome: () => void;
}

export const MinimalToolbar: React.FC<MinimalToolbarProps> = ({
  onOpenSettings,
  onOpenInfo,
  instrument,
  onInstrumentChange,
  currentRoot,
  onRootChange,
  bpm,
  onBpmChange,
  instrumentExercises,
  selectedExercise,
  onSelectExercise,
  topLevelId,
  onTopLevelChange,
  isPlaying,
  onPlayPause,
  onRestart,
  isLooping,
  onToggleLoop,
  isMetronomeActive,
  onToggleMetronome,
}) => {
  const { atlases, books } = useMemo(() => {
    const atlasSet = new Set<string>();
    const bookMap = new Map<string, string>(); // id -> title
    instrumentExercises.forEach(e => {
      if (e.atlas) atlasSet.add(e.atlas);
      const bId = e.sourceBookId || e.bookReference;
      const bTitle = e.source?.title || e.bookReference;
      if (bId && bTitle) {
        bookMap.set(`book:${bId}`, bTitle);
      }
    });
    return {
      atlases: Array.from(atlasSet).sort(),
      books: Array.from(bookMap.entries()).sort((a,b) => a[1].localeCompare(b[1]))
    };
  }, [instrumentExercises]);

  const filteredExercises = useMemo(() => {
    if (topLevelId.startsWith('book:')) {
      const bId = topLevelId.replace('book:', '');
      return instrumentExercises.filter(e => (e.sourceBookId || e.bookReference) === bId);
    } else {
      const atlas = topLevelId.replace('atlas:', '');
      return instrumentExercises.filter(e => e.atlas === atlas);
    }
  }, [instrumentExercises, topLevelId]);

  return (
    <header
      className="shrink-0 h-12 bg-stone-900 border-b border-stone-800 flex items-center justify-between text-xs text-stone-200 select-none z-30 overflow-x-auto whitespace-nowrap hide-scrollbar px-3"
      aria-label="Exercise toolbar"
    >
      <div className="flex items-center min-w-max gap-3 pr-4">
        {/* Instrument Toggle */}
        <div className="flex items-center rounded-lg bg-stone-950 p-0.5 border border-stone-800">
          <button
            onClick={() => onInstrumentChange('bass')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide transition-all ${
              instrument === 'bass'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Switch to Bass guitar mode"
          >
            Bass
          </button>
          <button
            onClick={() => onInstrumentChange('guitar')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide transition-all ${
              instrument === 'guitar'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Switch to Guitar mode"
          >
            Guitar
          </button>
        </div>

        {/* Root Note Transposition Picker */}
        <div className="flex items-center gap-1.5 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
          <span className="text-[10px] uppercase font-mono text-stone-400 font-semibold">Root</span>
          <div className="relative">
            <select
              value={currentRoot}
              onChange={(e) => onRootChange(e.target.value)}
              aria-label="Transpose root key"
              className="appearance-none pl-2 pr-5 py-0.5 rounded bg-stone-800 border border-stone-700 text-xs font-bold text-rose-400 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              {NOTE_NAMES.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-rose-400/80 absolute right-1.5 top-1.5 pointer-events-none" />
          </div>
        </div>

        {/* Navigation Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Top Level (Atlas / Book) Dropdown */}
          <div className="relative">
            <select
              value={topLevelId}
              onChange={e => onTopLevelChange(e.target.value)}
              className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-[11px] font-semibold text-amber-400 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
            >
              {topLevelId.startsWith('book:') && (
                <option value={topLevelId}>
                  Book: {books.find(b => b[0] === topLevelId)?.[1] || topLevelId.replace('book:', '')}
                </option>
              )}
              <optgroup label="Categories">
                {atlases.map(a => (
                  <option key={`atlas:${a}`} value={`atlas:${a}`}>
                    {a}
                  </option>
                ))}
              </optgroup>
            </select>
            <ChevronDown className="w-3 h-3 text-amber-500/70 absolute right-2 top-2 pointer-events-none" />
          </div>

          {/* Exercise Dropdown */}
          <div className="relative">
            <select
              value={selectedExercise.id}
              onChange={e => {
                const ex = filteredExercises.find(x => x.id === e.target.value);
                if (ex) onSelectExercise(ex);
              }}
              className="appearance-none pl-2.5 pr-6 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-[11px] font-semibold text-stone-200 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer max-w-[180px] sm:max-w-[260px] truncate"
            >
              {filteredExercises.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} {ex.variationType && ex.variationType !== 'base' ? '(Var)' : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2 top-2 pointer-events-none" />
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
            {/* Restart */}
            <button
              onClick={onRestart}
              title="Restart from beginning"
              aria-label="Restart exercise"
              className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause */}
            <button
              onClick={onPlayPause}
              aria-label={isPlaying ? 'Pause exercise' : 'Play exercise'}
              className={`flex items-center gap-1 px-3 py-1 rounded font-bold text-xs transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-amber-400/40'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-100 hover:text-white'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Loop toggle */}
            <button
              onClick={onToggleLoop}
              title={isLooping ? 'Looping enabled' : 'Looping disabled'}
              aria-label="Toggle loop"
              className={`p-1 rounded transition-colors ${
                isLooping
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'hover:bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
            </button>

            {/* Metronome Click */}
            <button
              onClick={onToggleMetronome}
              title={isMetronomeActive ? 'Metronome Click On' : 'Metronome Click Off'}
              aria-label="Toggle metronome click"
              className={`p-1 rounded transition-colors ${
                isMetronomeActive
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'hover:bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              {isMetronomeActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* BPM display / quick adjuster */}
          <div className="flex items-center gap-1.5 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
            <span className="text-[10px] text-stone-400 font-mono font-medium">BPM</span>
            <input
              type="number"
              min={30}
              max={260}
              value={bpm}
              onChange={(e) => onBpmChange(Number(e.target.value) || 80)}
              className="w-12 text-center bg-stone-800 border border-stone-700 rounded px-1 py-0.5 text-xs font-bold text-amber-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Right: Settings & Info */}
        <div className="flex items-center gap-2">
          {/* Settings Modal Toggle */}
          <button
            onClick={onOpenSettings}
            title="Open Settings (BPM, Tuning, Root, Display)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium border border-stone-700 transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Info ⓘ Button */}
          <button
            onClick={onOpenInfo}
            title="Exercise Details & Practice Notes (ⓘ)"
            aria-label="View exercise details and practice notes"
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors border border-stone-700"
          >
            <Info className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

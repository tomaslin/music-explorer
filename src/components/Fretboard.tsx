import React, { useMemo } from 'react';
import { InstrumentType, BassStringType, NoteDefinition } from '../types';
import {
  getIntervalStyle,
  midiToNote,
  ENHARMONIC_MAP,
} from '../utils/musicTheory';
import { getInstrumentProfile } from '../utils/instrumentRegistry';
import { soundEngine } from '../utils/audioSynth';

interface FretboardProps {
  instrument: InstrumentType;
  bassStrings: BassStringType;
  profileId: string;
  currentRoot: string;
  exerciseNotes: NoteDefinition[];
  activeNoteIndex: number | null;
  displayMode: 'intervals' | 'noteNames';
  showHandPositionBox: boolean;
  anchorFret: number;
  anchorStringNumber: number;
  onFretClick: (noteName: string, octave: number, stringNumber: number, fret: number) => void;
}

export const Fretboard: React.FC<FretboardProps> = ({
  instrument,
  bassStrings,
  profileId,
  currentRoot,
  exerciseNotes,
  activeNoteIndex,
  displayMode,
  showHandPositionBox,
  anchorFret,
  anchorStringNumber,
  onFretClick,
}) => {
  const profile = getInstrumentProfile(profileId, instrument);
  const TOTAL_FRETS = profile.maxFret;
  const strings = useMemo(
    () => profile.strings,
    [profile]
  );
  const exerciseNoteMap = useMemo(() => {
    const map = new Map<string, NoteDefinition>();
    exerciseNotes.forEach((n) => {
      if (n.isRest) return;
      const key = `${n.stringNumber}-${n.fret}`;
      if (!map.has(key) || n.isRoot) {
        map.set(key, n);
      }
    });
    return map;
  }, [exerciseNotes]);
  const activeEventNotes = useMemo(() => activeNoteIndex === null ? [] : exerciseNotes.filter(n => n.eventIndex === activeNoteIndex), [exerciseNotes, activeNoteIndex]);
  const singleDotFrets = [3, 5, 7, 9, 15, 17, 19, 21];
  const doubleDotFrets = [12, 24];

  const handleCellClick = (stringNumber: number, fret: number, midi: number) => {
    const { noteName, octave } = midiToNote(midi);
    soundEngine.playStringNote(midi, instrument === 'bass', 0.4);
    onFretClick(noteName, octave, stringNumber, fret);
  };

  return (
    <div className="w-full h-full flex flex-col bg-stone-950 select-none overflow-hidden border-t border-stone-800">
      
      <div className="flex items-center justify-between px-4 py-1 bg-stone-900 border-b border-stone-800 text-[11px] text-stone-400">
        <div className="flex items-center gap-2">
          <span className="font-medium text-stone-300">
            {profile.label}
          </span>
          <span className="text-stone-500 hidden sm:inline">• Click fret to transpose root</span>
        </div>

        <div className="flex items-center gap-3">
          {showHandPositionBox && (
            <span className="hidden md:inline text-stone-400">
              Position: Frets {Math.max(1, anchorFret - 1)}–{anchorFret + 4}
            </span>
          )}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400">Root:</span>
            <span className="px-1.5 py-0.2 rounded bg-rose-800 text-white font-bold text-[11px]">
              {currentRoot}
            </span>
          </div>
        </div>
      </div>

      
      <div className="flex-1 overflow-x-auto overflow-y-hidden hide-scrollbar flex flex-col justify-center px-4 py-2 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 relative">
        <div className="min-w-[900px] w-full max-w-7xl mx-auto flex flex-col justify-center relative">
          
          
          <div className="flex w-full pl-12 pr-4 mb-1 text-[11px] font-mono text-stone-400">
            {Array.from({ length: TOTAL_FRETS + 1 }).map((_, fret) => (
              <div
                key={`top-fret-${fret}`}
                className="flex-1 text-center"
                style={{ flexBasis: fret === 0 ? '48px' : 'auto' }}
              >
                {fret === 0 ? 'NUT' : fret}
              </div>
            ))}
          </div>

          
          <div className="relative rounded-lg shadow-2xl border border-stone-800 bg-[#1e1b18] overflow-hidden">
            
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 80px)',
              }}
            />

            
            {showHandPositionBox && (() => {
              const boxStartFret = Math.max(1, anchorFret - 1);
              const boxEndFret = Math.min(TOTAL_FRETS, Math.max(boxStartFret + 4, anchorFret + 4));
              const fretSpan = boxEndFret - boxStartFret + 1;
              const startRatio = (boxStartFret - 1) / TOTAL_FRETS;
              const widthRatio = fretSpan / TOTAL_FRETS;
              return (
                <div
                  className="absolute top-0 bottom-0 pointer-events-none border-2 border-amber-500/50 bg-amber-400/5 rounded transition-all duration-300 z-10"
                  style={{
                    left: `calc(48px + ((100% - 48px) * ${startRatio}))`,
                    width: `calc((100% - 48px) * ${widthRatio})`,
                  }}
                />
              );
            })()}

            
            <div className="absolute inset-0 pointer-events-none flex items-center pl-12 pr-4 z-0">
              {Array.from({ length: TOTAL_FRETS }).map((_, fIdx) => {
                const fret = fIdx + 1;
                const isSingle = singleDotFrets.includes(fret);
                const isDouble = doubleDotFrets.includes(fret);

                return (
                  <div key={`dot-${fret}`} className="flex-1 flex flex-col items-center justify-center gap-5">
                    {isSingle && (
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 shadow-inner opacity-75" />
                    )}
                    {isDouble && (
                      <>
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 shadow-inner opacity-75" />
                        <div className="w-3 h-3 rounded-full bg-gradient-to-br from-stone-200 to-stone-400 shadow-inner opacity-75" />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            
            <div className="relative z-10 flex flex-col divide-y divide-stone-800/40">
              {strings.map((str, strRowIdx) => {
                const gaugePx = instrument === 'bass'
                  ? Math.max(2, 6 - strRowIdx * 1.1)
                  : Math.max(1.5, 4 - strRowIdx * 0.5);

                return (
                  <div
                    key={`string-${str.stringNumber}`}
                    className="relative flex items-center h-11 transition-colors hover:bg-white/[0.02]"
                  >
                    
                    <div className="w-12 h-full flex items-center justify-center bg-stone-900/90 border-r-4 border-stone-300 text-xs font-bold text-amber-300 shrink-0 z-20 shadow-md">
                      {str.noteName}
                    </div>

                    
                    <div
                      className="absolute left-12 right-0 pointer-events-none z-10 shadow-sm"
                      style={{
                        height: `${gaugePx}px`,
                        background: 'linear-gradient(180deg, #e5e5e5 0%, #a3a3a3 50%, #737373 100%)',
                      }}
                    />

                    
                    <div className="flex-1 flex h-full">
                      {Array.from({ length: TOTAL_FRETS + 1 }).map((_, fret) => {
                        const midi = str.midi + fret;
                        const { noteName, octave } = midiToNote(midi);
                        const noteKey = `${str.stringNumber}-${fret}`;
                        const matchingExerciseNote = exerciseNoteMap.get(noteKey);
                        const currentlyPlayingNote = activeEventNotes.find(
                          n => n.stringNumber === str.stringNumber && n.fret === fret
                        );
                        const isCurrentlyPlaying = Boolean(currentlyPlayingNote);
                        const displayedNote = currentlyPlayingNote || matchingExerciseNote;
                        const cleanTarget = ENHARMONIC_MAP[currentRoot] || currentRoot;
                        const cleanCurrent = ENHARMONIC_MAP[noteName] || noteName;
                        const isRootNote = cleanCurrent === cleanTarget;
                        const isExactRootAnchor = isRootNote && str.stringNumber === anchorStringNumber && fret === anchorFret;

                        return (
                          <div
                            key={`fret-${str.stringNumber}-${fret}`}
                            onClick={() => handleCellClick(str.stringNumber, fret, midi)}
                            className={`flex-1 h-full flex items-center justify-center relative cursor-pointer border-r border-stone-600/70 hover:bg-amber-500/10 transition-all ${
                              fret === 0 ? 'bg-stone-900/40 max-w-[48px]' : ''
                            }`}
                            title={`Click to set Root & Transpose to ${noteName}${octave} (${str.noteName}-string Fret ${fret})`}
                          >
                            
                            {fret > 0 && (
                              <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-stone-400 via-stone-200 to-stone-500 shadow-[1px_0_2px_rgba(0,0,0,0.5)] pointer-events-none" />
                            )}

                            
                            {displayedNote ? (
                              <div
                                className={`relative z-30 rounded-full flex items-center justify-center font-bold text-xs transition-transform transform ${
                                  isCurrentlyPlaying
                                    ? 'scale-125 ring-4 ring-amber-300 ring-offset-2 ring-offset-stone-950 shadow-2xl z-40 animate-pulse font-black'
                                    : 'hover:scale-110 shadow-md'
                                } ${displayedNote.isRoot ? 'ring-2 ring-white/90' : ''}`}
                                style={{
                                  backgroundColor: isCurrentlyPlaying
                                    ? '#f59e0b'
                                    : getIntervalStyle(displayedNote.intervalDegree).hex,
                                  color: isCurrentlyPlaying ? '#0f172a' : '#ffffff',
                                  width: instrument === 'bass' ? '28px' : '24px',
                                  height: instrument === 'bass' ? '28px' : '24px',
                                }}
                              >
                                {displayMode === 'intervals'
                                  ? displayedNote.intervalDegree
                                  : noteName}
                              </div>
                            ) : isRootNote ? (
                              <div
                                className={`w-4 h-4 rounded-full border text-[9px] flex items-center justify-center font-mono transition-all z-20 ${isExactRootAnchor ? 'border-amber-300 bg-amber-400/30 text-amber-100 scale-125 shadow-lg' : 'border-rose-700/50 bg-rose-700/10 text-rose-300 opacity-60 hover:opacity-100 hover:scale-110'}`}
                                title={`Root octave: ${noteName}${octave}`}
                              >
                                R
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          
          <div className="flex w-full pl-12 pr-4 mt-1 text-[11px] font-mono text-stone-400">
            {Array.from({ length: TOTAL_FRETS + 1 }).map((_, fret) => (
              <div
                key={`bot-fret-${fret}`}
                className="flex-1 text-center"
                style={{ flexBasis: fret === 0 ? '48px' : 'auto' }}
              >
                {fret === 0 ? '' : fret}
              </div>
            ))}
          </div>

        </div>
      </div>

      
    </div>
  );
};

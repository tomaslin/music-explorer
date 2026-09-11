export type InstrumentType = 'bass' | 'guitar';
export type BassStringType = 4;
export type BassType = 'electric' | 'upright' | 'synth';
export type Microtiming = 'straight' | 'laid-back' | 'ahead' | 'swing-light' | 'swing-heavy' | 'shuffle';
export type AccentType = 'normal' | 'accent' | 'marcato' | 'ghost';
export const NOTE_NAMES = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'] as const;
export type NoteName = typeof NOTE_NAMES[number];

export interface InstrumentString { stringNumber:number; noteName:string; octave:number; midi:number; }
export interface InstrumentProfile { id:string; label:string; instrument:InstrumentType; strings:InstrumentString[]; maxFret:number; description:string; }
export interface ExerciseNote {
  semitoneFromRoot:number; octaveOffset:number; duration:string; intervalDegree?:string; preferredString?:number;
  isRest?:boolean; isDeadNote?:boolean; noteRole?:string; localHarmony?:string; chordRootOffset?:number; technique?:string;
  velocity?:number; accent?:AccentType; microtiming?:Microtiming; eventIndex?:number;
  leftHandFinger?: '1'|'2'|'3'|'4'|'T'; rightHandFinger?: 'p'|'i'|'m'|'a'|'c'|'slap'|'pop'|'pick-down'|'pick-up'|'T'|'e'|'i-up'|'T-dn';
  slurToNext?: boolean;
}
export interface ExerciseEvent { startBeat:number; duration:string; notes:ExerciseNote[]; label?:string; }
export interface RhythmicStructure {
  meter: string;
  grouping: number[];
  subdivision: string;
  feel: Microtiming;
  cycleLengthBeats: number;
  phraseType: 'bar-loop' | 'pickup' | 'phrase' | 'open-ended';
  claveOrientation?: '2-3-son' | '3-2-son' | '2-3-rumba' | '3-2-rumba';
  customMetronomePattern?: Array<{ beat: number; isAccent: boolean }>;
  cycleStartBeat?: number;
}
export interface NoteDefinition { midi?:number; isPlayable?: boolean; pitch:string; octave:number; step:string; accidental?:'b'|'#'|'n'|'##'|'bb'; duration?:string; stringNumber:number; fret:number; intervalDegree:string; isRoot?:boolean; isChordTone?:boolean; isRest?:boolean; isDeadNote?:boolean; noteRole?:string; localHarmony?:string; chordRootOffset?:number; technique?:string; velocity?:number; accent?:AccentType; microtiming?:Microtiming; eventIndex?:number; leftHandFinger?:string; rightHandFinger?:string; slurToNext?:boolean; }
export interface FretboardPosition { stringIndex:number; fret:number; noteName:string; octave:number; midi:number; }
export interface ActiveNoteState { index:number; note:NoteDefinition; }

export interface ChordProgressionSymbol { beat: number; symbol: string; }

export interface ExerciseItem {
  id: string;
  title: string;
  atlas: string;
  instrument: InstrumentType;
    clef: 'bass' | 'treble';
  timeSignature: string;
  defaultBpm: number;
  subdivision: 'quarter' | 'eighth' | 'sixteenth' | 'triplet';
  playableKeys?: NoteName[];
  targetProfiles?: string[];
  phraseType?: 'bar-loop' | 'pickup' | 'phrase' | 'open-ended';
  cycleLengthBeats?: number;
  chordProgression?: ChordProgressionSymbol[];
  notes: ExerciseNote[];
  events: ExerciseEvent[];
  rhythmicStructure?: RhythmicStructure;
  genreSubcategory?: string;
  subtype?: string;
    }


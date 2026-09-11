export type InstrumentType = 'bass' | 'guitar';
export type BassStringType = 4;
export type BassType = 'electric' | 'upright' | 'synth';
export type Microtiming = 'straight' | 'laid-back' | 'ahead' | 'swing-light' | 'swing-heavy' | 'shuffle';
export type AccentType = 'normal' | 'accent' | 'marcato' | 'ghost';
export const NOTE_NAMES = ['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'] as const;
export type NoteName = typeof NOTE_NAMES[number];

export type SourceType =
  | 'published-method'
  | 'published-theory'
  | 'published-etude-collection'
  | 'published-transcription'
  | 'artist-method'
  | 'artist-reference'
  | 'artist-transcription'
  | 'play-along-method'
  | 'ethnomusicology/reference'
  | 'academic-article'
  | 'ethnomusicology-book'
  | 'music-history-reference'
  | 'academic-book-chapter'
  | 'music-theory-book'
  | 'music-history'
  | 'music-reference'
  | 'academic-book'
  | 'academic-dissertation'
  | 'web-course'
  | 'music-history-book'
  | 'archive-reference'
  | 'instructional-article'
  | 'doctoral-thesis'
  | 'academic-thesis-reference'
  | 'guitar-method'
  | 'oral/tradition-reference'
  | 'original-synthesis'
  | 'verified-digital-course'
  | 'unverified-reference';

export type SourceVerificationStatus =
  | 'verified'
  | 'verified-topic'
  | 'unverified';

export type VariationType =
  | 'base'
  | 'foundational'
  | 'variation'
  | 'rhythmic'
  | 'rhythmic-variation'
  | 'rhythmic-variant'
  | 'phrase'
  | 'phrase-variant'
  | 'accent'
  | 'displacement'
  | 'syncopation'
  | 'anticipation'
  | 'subdivision'
  | 'meter'
  | 'clave'
  | 'clave-variant'
  | 'harmonic'
  | 'harmonic-variation'
  | 'harmonic-variant'
  | 'melodic'
  | 'melodic-variation'
  | 'melodic-variant'
  | 'interval'
  | 'register'
  | 'register-variation'
  | 'register-variant'
  | 'position'
  | 'positional-variation'
  | 'position-variant'
  | 'voicing'
  | 'inversion'
  | 'arpeggio'
  | 'articulation'
  | 'articulation-variation'
  | 'technique'
  | 'technique-variant'
  | 'instrument'
  | 'instrument-variation'
  | 'instrument-variant'
  | 'role'
  | 'role-variant'
  | 'orchestration'
  | 'call-response'
  | 'application'
  | 'advanced-application'
  | 'style-application'
  | 'stylistic-variation'
  | 'extension'
  | 'combination'
  | 'combination-of'
  | 'contrast'
  | 'contrast-to'
  | 'derived'
  | 'derivation'
  | 'derived-from'
  | 'variation-of'
  | 'application-of'
  | 'alternative'
  | 'exact-duplicate'
  | 'concept-duplicate'
  | 'key-variant'
  | 'orientation-variant'
  | 'complement'
  | 'permutation'
  | 'etude'
  | 'microtiming'
  | 'cadence';

export interface ExerciseSource {
  title: string;
  author: string;
  chapters?: string[];
}
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

export type LibrarySection = 'genre' | 'instrument-exercises' | 'theory';
export type InstrumentExerciseCategory = 'Fretboard & Harmony' | 'Technique & Speed' | 'Rhythm & Coordination' | 'Soloing & Improvisation' | 'Style Applications' | 'Theory Applications';

export interface ExerciseItem {
  id: string;
  title: string;
  atlas: string;
  tags: string[];
    bookReference?: string;
  description: string;
  instrument: InstrumentType;
    clef: 'bass' | 'treble';
  timeSignature: string;
  defaultBpm: number;
  subdivision: 'quarter' | 'eighth' | 'sixteenth' | 'triplet';
      source?: ExerciseSource;
  playableKeys?: NoteName[];
  feel?: Microtiming;
  targetProfiles?: string[];
  rhythmTags?: string[];
  styleTags?: string[];
  techniqueTags?: string[];
  conceptTags?: string[];
  harmonyTags?: string[];
  instrumentTags?: string[];
  bassType?: BassType;
  phraseType?: 'bar-loop' | 'pickup' | 'phrase' | 'open-ended';
  cycleLengthBeats?: number;
  chordProgression?: ChordProgressionSymbol[];
  notes: ExerciseNote[];
  focus: string;
  events: ExerciseEvent[];
  rhythmicStructure?: RhythmicStructure;
  musicalRole?: string;
  familyId?: string;
  variationType?: string;
  parentExerciseId?: string;
  sourceBookId?: string;
  genreParent?: string;
  genreSubcategory?: string;
  librarySections?: LibrarySection[];
  instrumentExerciseCategory?: InstrumentExerciseCategory;
  instrumentExerciseSubcategory?: string;
  /** Optional human-readable reference context. Not a claim of transcription/source derivation. */
  sourceReferenceType?: 'source' | 'reference-context' | 'original';
    }

export interface SourceBibliographyItem {
  id: string;
  title: string;
  author: string;
  language?: string;
  sourceType: SourceType;
  verificationStatus: SourceVerificationStatus;
  publisher?: string;
  publicationYear?: number;
  scope?: string[];
}

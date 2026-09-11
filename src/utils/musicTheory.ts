import { InstrumentType, BassStringType, NoteDefinition, FretboardPosition } from '../types';
import { getInstrumentProfile, INSTRUMENT_PROFILES, INSTRUMENT_PROFILE_MAP } from './instrumentRegistry';

export { getInstrumentProfile, INSTRUMENT_PROFILES, INSTRUMENT_PROFILE_MAP } from './instrumentRegistry';

export const NOTE_NAMES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'] as const;
export type NoteName = typeof NOTE_NAMES[number];

export const ENHARMONIC_MAP: Record<string, string> = {
  'Db': 'C#',
  'D#': 'Eb',
  'Gb': 'F#',
  'G#': 'Ab',
  'A#': 'Bb',
  'Cb': 'B',
  'E#': 'F',
  'Fb': 'E',
  'B#': 'C',
};

// Standard tunings, highest string first.

export const BASS_4_STRINGS = [
  { stringNumber: 1, noteName: 'G', octave: 2, midi: 43 },
  { stringNumber: 2, noteName: 'D', octave: 2, midi: 38 },
  { stringNumber: 3, noteName: 'A', octave: 1, midi: 33 },
  { stringNumber: 4, noteName: 'E', octave: 1, midi: 28 },
];

export const GUITAR_6_STRINGS = [
  { stringNumber: 1, noteName: 'E', octave: 4, midi: 64 },
  { stringNumber: 2, noteName: 'B', octave: 3, midi: 59 },
  { stringNumber: 3, noteName: 'G', octave: 3, midi: 55 },
  { stringNumber: 4, noteName: 'D', octave: 3, midi: 50 },
  { stringNumber: 5, noteName: 'A', octave: 2, midi: 45 },
  { stringNumber: 6, noteName: 'E', octave: 2, midi: 40 },
];

export function getDefaultRootOctaveAndAnchor(
  rootName: string,
  instrument: InstrumentType
): { octave: number; anchorFret: number } {
  const clean = (ENHARMONIC_MAP[rootName] || rootName) as string;
  if (instrument === 'bass') {
    // Standard 4-string bass: lowest string is E1 (MIDI 28)
    switch (clean) {
      case 'E': return { octave: 1, anchorFret: 1 };
      case 'F': return { octave: 1, anchorFret: 1 };
      case 'F#': case 'Gb': return { octave: 1, anchorFret: 2 };
      case 'G': return { octave: 1, anchorFret: 3 };
      case 'G#': case 'Ab': return { octave: 1, anchorFret: 4 };
      case 'A': return { octave: 1, anchorFret: 1 };
      case 'A#': case 'Bb': return { octave: 1, anchorFret: 1 };
      case 'B': return { octave: 1, anchorFret: 2 };
      case 'C': return { octave: 2, anchorFret: 3 };
      case 'C#': case 'Db': return { octave: 2, anchorFret: 4 };
      case 'D': return { octave: 2, anchorFret: 1 };
      case 'D#': case 'Eb': return { octave: 2, anchorFret: 1 };
      default: return { octave: 2, anchorFret: 3 };
    }
  } else {
    // Standard 6-string guitar: lowest string is E2 (MIDI 40)
    switch (clean) {
      case 'E': return { octave: 2, anchorFret: 1 };
      case 'F': return { octave: 2, anchorFret: 1 };
      case 'F#': case 'Gb': return { octave: 2, anchorFret: 2 };
      case 'G': return { octave: 2, anchorFret: 3 };
      case 'G#': case 'Ab': return { octave: 2, anchorFret: 4 };
      case 'A': return { octave: 2, anchorFret: 1 };
      case 'A#': case 'Bb': return { octave: 2, anchorFret: 1 };
      case 'B': return { octave: 2, anchorFret: 2 };
      case 'C': return { octave: 3, anchorFret: 3 };
      case 'C#': case 'Db': return { octave: 3, anchorFret: 4 };
      case 'D': return { octave: 3, anchorFret: 1 };
      case 'D#': case 'Eb': return { octave: 3, anchorFret: 1 };
      default: return { octave: 3, anchorFret: 3 };
    }
  }
}


export const NOTE_SEMITONES: Record<string, number> = {
  'C': 0, 'C#': 1, 'Db': 1,
  'D': 2, 'D#': 3, 'Eb': 3,
  'E': 4,
  'F': 5, 'F#': 6, 'Gb': 6,
  'G': 7, 'G#': 8, 'Ab': 8,
  'A': 9, 'A#': 10, 'Bb': 10,
  'B': 11,
};


export const INTERVAL_COLORS: Record<string, { bg: string; text: string; hex: string; label: string }> = {
  'R': { bg: 'bg-rose-700', text: 'text-white', hex: '#be185d', label: 'Root' },
  '1': { bg: 'bg-rose-700', text: 'text-white', hex: '#be185d', label: 'Root' },
  'b2': { bg: 'bg-amber-700', text: 'text-white', hex: '#c2410c', label: 'Min 2nd' },
  '2': { bg: 'bg-amber-600', text: 'text-white', hex: '#d97706', label: 'Maj 2nd / 9th' },
  '9': { bg: 'bg-amber-600', text: 'text-white', hex: '#d97706', label: '9th' },
  'b3': { bg: 'bg-emerald-700', text: 'text-white', hex: '#047857', label: 'Min 3rd' },
  '3': { bg: 'bg-emerald-600', text: 'text-white', hex: '#059669', label: 'Maj 3rd' },
  '4': { bg: 'bg-teal-600', text: 'text-white', hex: '#0d9488', label: 'Perf 4th / 11th' },
  '11': { bg: 'bg-teal-600', text: 'text-white', hex: '#0d9488', label: '11th' },
  '#4': { bg: 'bg-sky-600', text: 'text-white', hex: '#0284c7', label: '#11 / #4' },
  '#11': { bg: 'bg-sky-600', text: 'text-white', hex: '#0284c7', label: '#11' },
  'b5': { bg: 'bg-sky-700', text: 'text-white', hex: '#0369a1', label: 'Dim 5th' },
  '5': { bg: 'bg-blue-600', text: 'text-white', hex: '#2563eb', label: 'Perf 5th' },
  '#5': { bg: 'bg-indigo-600', text: 'text-white', hex: '#4f46e5', label: 'Aug 5th' },
  'b6': { bg: 'bg-indigo-600', text: 'text-white', hex: '#4f46e5', label: 'Min 6th' },
  '6': { bg: 'bg-violet-600', text: 'text-white', hex: '#7c3aed', label: 'Maj 6th / 13th' },
  '13': { bg: 'bg-violet-600', text: 'text-white', hex: '#7c3aed', label: '13th' },
  'bb7': { bg: 'bg-purple-800', text: 'text-white', hex: '#6b21a8', label: 'Dim 7th' },
  'b7': { bg: 'bg-purple-600', text: 'text-white', hex: '#9333ea', label: 'Min 7th' },
  '7': { bg: 'bg-fuchsia-600', text: 'text-white', hex: '#c026d3', label: 'Maj 7th' },
  'default': { bg: 'bg-stone-600', text: 'text-white', hex: '#52525b', label: 'Note' },
};

export function getIntervalStyle(degree: string) {
  return INTERVAL_COLORS[degree] || INTERVAL_COLORS['default'];
}

export function noteToMidi(noteName: string, octave: number): number {
  const clean = ENHARMONIC_MAP[noteName] || noteName;
  const semitone = NOTE_SEMITONES[clean] ?? 0;
  return (octave + 1) * 12 + semitone;
}

export function midiToNote(midi: number, preferFlat = false): { noteName: string; octave: number } {
  const semitone = midi % 12;
  const octave = Math.floor(midi / 12) - 1;
  const sharpNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const flatNames = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
  const noteName = preferFlat ? flatNames[semitone] : sharpNames[semitone];
  return { noteName, octave };
}

export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}


export const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Dm', 'Gm', 'Cm', 'Fm', 'Bbm', 'Ebm']);



export function getPlayableRootsForExercise(
  exercise: { instrument: InstrumentType; events: Array<{ notes: Array<{ semitoneFromRoot: number; octaveOffset?: number; isRest?: boolean; isDeadNote?: boolean }> }>; playableKeys?: string[] },
  profileId?: string,
): NoteName[] {
  const profile = getInstrumentProfile(profileId, exercise.instrument);
  const roots = NOTE_NAMES.filter(r => !exercise.playableKeys?.length || exercise.playableKeys.includes(r));

  const canVoiceEvent = (event: { notes: Array<{ semitoneFromRoot: number; octaveOffset?: number; isRest?: boolean; isDeadNote?: boolean }> }, rootMidi: number) => {
    const playable = event.notes
      .filter(note => !note.isRest && !note.isDeadNote)
      .map(note => rootMidi + note.semitoneFromRoot + (note.octaveOffset || 0) * 12);
    if (playable.length <= 1) {
      return playable.every(midi => profile.strings.some(string => {
        const fret = midi - string.midi;
        return fret >= 0 && fret <= profile.maxFret;
      }));
    }
    const candidates = playable.map(midi => profile.strings.flatMap(string => {
      const fret = midi - string.midi;
      return fret >= 0 && fret <= profile.maxFret ? [string.stringNumber] : [];
    }));
    const used = new Set<number>();
    const assign = (index: number): boolean => {
      if (index === candidates.length) return true;
      for (const stringNumber of candidates[index]) {
        if (used.has(stringNumber)) continue;
        used.add(stringNumber);
        if (assign(index + 1)) return true;
        used.delete(stringNumber);
      }
      return false;
    };
    return assign(0);
  };

  return roots.filter(root => {
    const { octave } = getDefaultRootOctaveAndAnchor(root, exercise.instrument);
    const rootMidi = noteToMidi(root, octave);
    return exercise.events.every(event => canVoiceEvent(event, rootMidi));
  });
}

export function isExercisePlayableAtRootContext(
  exercise: { instrument: InstrumentType; events: Array<{ notes: Array<{ semitoneFromRoot: number; octaveOffset?: number; isRest?: boolean; isDeadNote?: boolean }> }> },
  rootName: string,
  rootOctave: number,
  profileId?: string,
): boolean {
  const profile = getInstrumentProfile(profileId, exercise.instrument);
  const rootMidi = noteToMidi(rootName, rootOctave);
  return exercise.events.every(event => {
    const midis = event.notes
      .filter(note => !note.isRest && !note.isDeadNote)
      .map(note => rootMidi + note.semitoneFromRoot + (note.octaveOffset || 0) * 12);
    const candidates = midis.map(midi => profile.strings.flatMap(string => {
      const fret = midi - string.midi;
      return fret >= 0 && fret <= profile.maxFret ? [string.stringNumber] : [];
    }));
    const used = new Set<number>();
    const assign = (index: number): boolean => {
      if (index === candidates.length) return true;
      for (const stringNumber of candidates[index]) {
        if (used.has(stringNumber)) continue;
        used.add(stringNumber);
        if (assign(index + 1)) return true;
        used.delete(stringNumber);
      }
      return false;
    };
    return assign(0);
  });
}

export function getRootContextForProfile(rootName: string, instrument: InstrumentType, profileId?: string) {
  const profile = getInstrumentProfile(profileId, instrument);
  const clean = (ENHARMONIC_MAP[rootName] || rootName) as NoteName;
  const preferred = getDefaultRootOctaveAndAnchor(clean, instrument);
  const rootMidi = noteToMidi(clean, preferred.octave);
  const candidates = profile.strings
    .map(s => ({ stringNumber: s.stringNumber, fret: rootMidi - s.midi }))
    .filter(c => c.fret >= 0 && c.fret <= profile.maxFret)
    .sort((a,b) => Math.abs(a.fret-preferred.anchorFret)-Math.abs(b.fret-preferred.anchorFret));
  if (candidates.length) return { octave: preferred.octave, anchorFret: candidates[0].fret, anchorStringNumber: candidates[0].stringNumber };
  // If the profile cannot realize the preferred register, move by octaves until it can.
  for (const delta of [-1,1,-2,2,3,-3]) {
    const octave = preferred.octave + delta;
    const midi = noteToMidi(clean, octave);
    const found = profile.strings
      .map(s => ({ stringNumber: s.stringNumber, fret: midi - s.midi }))
      .filter(c => c.fret >= 0 && c.fret <= profile.maxFret)
      .sort((a,b) => Math.abs(a.fret-preferred.anchorFret)-Math.abs(b.fret-preferred.anchorFret))[0];
    if (found) return { octave, anchorFret: found.fret, anchorStringNumber: found.stringNumber };
  }
  return { octave: preferred.octave, anchorFret: preferred.anchorFret, anchorStringNumber: instrument === 'bass' ? 4 : 6 };
}


export function getRootContextForExercise(
  exercise: { instrument: InstrumentType; events: Array<{ notes: Array<{ semitoneFromRoot: number; octaveOffset?: number; isRest?: boolean; isDeadNote?: boolean }> }> },
  rootName: string,
  profileId?: string,
) {
  const profile = getInstrumentProfile(profileId, exercise.instrument);
  const clean = (ENHARMONIC_MAP[rootName] || rootName) as NoteName;
  const preferred = getDefaultRootOctaveAndAnchor(clean, exercise.instrument);
  const octaves = [preferred.octave, preferred.octave - 1, preferred.octave + 1, preferred.octave - 2, preferred.octave + 2, preferred.octave - 3, preferred.octave + 3];

  const fits = (rootMidi: number) => exercise.events.every(event => event.notes.every(note => {
    if (note.isRest || note.isDeadNote) return true;
    const midi = rootMidi + note.semitoneFromRoot + (note.octaveOffset || 0) * 12;
    return profile.strings.some(string => {
      const fret = midi - string.midi;
      return fret >= 0 && fret <= profile.maxFret;
    });
  }));

  for (const octave of octaves) {
    const rootMidi = noteToMidi(clean, octave);
    if (!fits(rootMidi)) continue;
    const candidates = profile.strings
      .map(s => ({ stringNumber: s.stringNumber, fret: rootMidi - s.midi }))
      .filter(c => c.fret >= 0 && c.fret <= profile.maxFret)
      .sort((a,b) => Math.abs(a.fret - preferred.anchorFret) - Math.abs(b.fret - preferred.anchorFret));
    if (candidates.length) return { octave, anchorFret: candidates[0].fret, anchorStringNumber: candidates[0].stringNumber };
  }

  // Preserve a valid physical root anchor even for notation-only/out-of-range material.
  return getRootContextForProfile(rootName, exercise.instrument, profileId);
}

export function getScaleNoteName(rootName: string, semitonesFromRoot: number): string {
  const rootIndex = NOTE_SEMITONES[rootName] ?? 0;
  const targetIndex = (rootIndex + semitonesFromRoot) % 12;
  const isFlatKey = FLAT_KEYS.has(rootName) || rootName.includes('b');
  const names = isFlatKey
    ? ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
    : ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return names[targetIndex];
}


export function getInstrumentStrings(instrument: InstrumentType, bassStrings: BassStringType = 4, profileId?: string) {
  if (profileId) return getInstrumentProfile(profileId, instrument).strings;
  if (instrument === 'guitar') return getInstrumentProfile('guitar-6-standard', 'guitar').strings;
  return getInstrumentProfile('bass-4-standard', 'bass').strings;
}


export function getFretForNote(stringMidi: number, targetMidi: number, maxFret = 24): number | null {
  const fret = targetMidi - stringMidi;
  if (fret >= 0 && fret <= maxFret) {
    return fret;
  }
  return null;
}


export function findOptimalFingering(
  targetMidi: number,
  instrument: InstrumentType,
  bassStrings: BassStringType,
  anchorFret: number = 3,
  maxFretSpan: number = 5,
  profileId?: string
): { stringNumber: number; fret: number } {
  const profile = getInstrumentProfile(profileId, instrument);
  const strings = profile.strings;
  const maxFret = profile.maxFret;
  const candidates: { stringNumber: number; fret: number; distance: number; cost: number }[] = [];

  for (const s of strings) {
    const fret = targetMidi - s.midi;
    if (fret >= 0 && fret <= maxFret) {
      let cost = Math.abs(fret - anchorFret) * 3;
      if (fret === 0 && anchorFret > 3) cost += 12 + anchorFret;
      if (fret > 19 && anchorFret < 15) cost += (fret - 19) * 3;
      candidates.push({ stringNumber: s.stringNumber, fret, distance: Math.abs(fret - anchorFret), cost });
    }
  }

  if (candidates.length === 0) {
    return { stringNumber: strings[0].stringNumber, fret: Math.max(0, Math.min(maxFret, targetMidi - strings[0].midi)) };
  }

  const inPosition = candidates.filter(c => c.fret >= Math.max(0, anchorFret - 1) && c.fret <= anchorFret + maxFretSpan);
  if (inPosition.length > 0) {
    inPosition.sort((a, b) => a.cost - b.cost);
    return inPosition[0];
  }

  candidates.sort((a, b) => a.cost - b.cost);
  return candidates[0];
}

export function findChordFingerings(
  notesOrMidis: (number | { midi: number; preferredString?: number; leftHandFinger?: number; isRest?: boolean })[],
  instrument: InstrumentType,
  bassStrings: BassStringType,
  anchorFret = 3,
  maxFretSpan = 5,
  profileId?: string,
): { stringNumber: number; fret: number; leftHandFinger?: number }[] {
  const profile = getInstrumentProfile(profileId, instrument);
  const normalized = notesOrMidis.map(item => typeof item === 'number' ? { midi: item, isRest: false } : item);

  if (normalized.length === 0) return [];
  if (normalized.length === 1) {
    const n = normalized[0];
    if (n.isRest || !n.midi) return [{ stringNumber: 1, fret: 0, leftHandFinger: undefined }];
    if (n.preferredString) {
      const s = profile.strings.find(str => str.stringNumber === n.preferredString);
      if (s) {
        const fret = n.midi - s.midi;
        if (fret >= 0 && fret <= profile.maxFret && Math.abs(fret - anchorFret) <= 5) {
          return [{ stringNumber: s.stringNumber, fret, leftHandFinger: n.leftHandFinger }];
        }
      }
    }
    const opt = findOptimalFingering(n.midi, instrument, bassStrings, anchorFret, maxFretSpan, profileId);
    return [{ stringNumber: opt.stringNumber, fret: opt.fret, leftHandFinger: n.leftHandFinger }];
  }

  // Multi-note chord solver
  const candidatesPerNote = normalized.map(n => {
    if (n.isRest || !n.midi) {
      return [{ stringNumber: 1, fret: 0, distance: 0, preferred: false, finger: undefined }];
    }
    const list: { stringNumber: number; fret: number; distance: number; preferred: boolean; finger?: number }[] = [];
    for (const s of profile.strings) {
      const fret = n.midi - s.midi;
      if (fret >= 0 && fret <= profile.maxFret) {
        const isPreferred = n.preferredString === s.stringNumber;
        let dist = fret === 0 ? (anchorFret <= 2 ? 0 : 8 + anchorFret) : Math.abs(fret - anchorFret);
        if (isPreferred && dist <= 5) dist -= 2;
        list.push({ stringNumber: s.stringNumber, fret, distance: dist, preferred: isPreferred, finger: n.leftHandFinger });
      }
    }
    if (list.length === 0) {
      list.push({ stringNumber: profile.strings[0].stringNumber, fret: Math.max(0, Math.min(profile.maxFret, n.midi - profile.strings[0].midi)), distance: 50, preferred: false, finger: n.leftHandFinger });
    }
    return list;
  });

  let best: { stringNumber: number; fret: number; leftHandFinger?: number }[] | null = null;
  let bestScore = Number.POSITIVE_INFINITY;

  const visit = (index: number, usedStrings: Set<number>, chosen: { stringNumber: number; fret: number; finger?: number }[]) => {
    if (index === candidatesPerNote.length) {
      const nonZeroFrets = chosen.map(c => c.fret).filter(f => f > 0);
      const span = nonZeroFrets.length > 1 ? Math.max(...nonZeroFrets) - Math.min(...nonZeroFrets) : 0;
      if (span > maxFretSpan) return; // Discard impossible spans

      const hasOpen = chosen.some(c => c.fret === 0);
      const maxFretVal = nonZeroFrets.length > 0 ? Math.max(...nonZeroFrets) : 0;
      if (hasOpen && maxFretVal > 4 && anchorFret >= 4) return;
      if (hasOpen && maxFretVal > 6) return;

      const anchorDist = chosen.reduce((sum, c) => {
        if (c.fret === 0) return sum + (anchorFret <= 2 ? 0 : 8 + anchorFret * 0.8);
        return sum + Math.abs(c.fret - anchorFret) * 4.0;
      }, 0);
      const score = span * 6 + anchorDist;
      if (score < bestScore) {
        bestScore = score;
        best = chosen.map(c => ({ stringNumber: c.stringNumber, fret: c.fret, leftHandFinger: c.finger }));
      }
      return;
    }

    for (const cand of candidatesPerNote[index]) {
      if (usedStrings.has(cand.stringNumber)) continue; // Must be unique strings
      usedStrings.add(cand.stringNumber);
      chosen.push({ stringNumber: cand.stringNumber, fret: cand.fret, finger: cand.finger });
      visit(index + 1, usedStrings, chosen);
      chosen.pop();
      usedStrings.delete(cand.stringNumber);
    }
  };

  visit(0, new Set<number>(), []);

  if (best) {
    // If left-hand fingers not assigned, assign ergonomically
    const nonZero = (best as { stringNumber: number; fret: number; leftHandFinger?: number }[]).filter(b => b.fret > 0);
    const minFret = nonZero.length > 0 ? Math.min(...nonZero.map(b => b.fret)) : anchorFret;
    return best.map(b => {
      if (b.leftHandFinger !== undefined) return b;
      if (b.fret === 0) return { ...b, leftHandFinger: undefined };
      const rel = b.fret - minFret + 1;
      const finger = Math.max(1, Math.min(4, rel));
      return { ...b, leftHandFinger: finger };
    });
  }

  // Fallback if no perfect combination (e.g. forced by external constraints)
  const used = new Set<number>();
  return normalized.map(n => {
    if (n.isRest || !n.midi) return { stringNumber: 1, fret: 0, leftHandFinger: undefined };
    for (const s of profile.strings) {
      if (!used.has(s.stringNumber)) {
        const fret = n.midi - s.midi;
        if (fret >= 0 && fret <= profile.maxFret) {
          used.add(s.stringNumber);
          return { stringNumber: s.stringNumber, fret, leftHandFinger: n.leftHandFinger };
        }
      }
    }
    const opt = findOptimalFingering(n.midi, instrument, bassStrings, anchorFret, maxFretSpan, profileId);
    return { stringNumber: opt.stringNumber, fret: opt.fret, leftHandFinger: n.leftHandFinger };
  });
}

export interface NoteFingeringResult {
  stringNumber: number;
  fret: number;
  leftHandFinger?: number;
}

/**
 * Computes an ergonomic, sequence-optimized fretboard fingering path across the full exercise.
 * Eliminates erratic hand jumping, respects preferred strings, and calculates realistic left-hand fingerings.
 */
export function computeErgonomicExerciseFingerings(
  eventNotes: {
    eventIndex: number;
    noteIndex: number;
    midi: number;
    isRest: boolean;
    preferredString?: number;
    leftHandFinger?: number;
    isChord?: boolean;
  }[][],
  instrument: InstrumentType,
  bassStrings: BassStringType,
  anchorFret: number = 3,
  profileId?: string
): NoteFingeringResult[][] {
  const profile = getInstrumentProfile(profileId, instrument);
  const strings = profile.strings;
  const maxFret = profile.maxFret;

  if (eventNotes.length === 0) return [];

  // Check if exercise is primarily chords
  const hasChords = eventNotes.some(ev => ev.filter(n => !n.isRest).length > 1);

  if (hasChords) {
    // Process event-by-event with position tracking
    let currentAnchor = anchorFret;
    return eventNotes.map(ev => {
      const activeNotes = ev.filter(n => !n.isRest);
      if (activeNotes.length === 0) {
        return ev.map(() => ({ stringNumber: 1, fret: 0, leftHandFinger: undefined }));
      }
      if (activeNotes.length === 1 && ev.length === 1) {
        const n = ev[0];
        const res = findChordFingerings([n], instrument, bassStrings, currentAnchor, 5, profileId);
        if (res[0].fret > 0) currentAnchor = res[0].fret;
        return res;
      }
      const chordRes = findChordFingerings(ev, instrument, bassStrings, currentAnchor, 5, profileId);
      const nonZero = chordRes.filter(c => c.fret > 0);
      if (nonZero.length > 0) {
        currentAnchor = Math.round(nonZero.reduce((s, c) => s + c.fret, 0) / nonZero.length);
      }
      return chordRes;
    });
  }

  // Melodic single-note sequence: use DP (Viterbi path)
  const flatNoteEntries: {
    eventIdx: number;
    noteIdx: number;
    midi: number;
    isRest: boolean;
    preferredString?: number;
    leftHandFinger?: number;
  }[] = [];

  eventNotes.forEach((ev, eIdx) => {
    ev.forEach((n, nIdx) => {
      flatNoteEntries.push({
        eventIdx: eIdx,
        noteIdx: nIdx,
        midi: n.midi,
        isRest: n.isRest,
        preferredString: n.preferredString,
        leftHandFinger: n.leftHandFinger,
      });
    });
  });

  if (flatNoteEntries.length === 0) return [];

  const candidateLists = flatNoteEntries.map((n) => {
    if (n.isRest || !n.midi) {
      return [{ stringNumber: 1, fret: 0, cost: 0, isRest: true, preferred: false }];
    }

    const list: { stringNumber: number; fret: number; cost: number; isRest: boolean; preferred: boolean }[] = [];
    for (const s of strings) {
      const fret = n.midi - s.midi;
      if (fret >= 0 && fret <= maxFret) {
        let baseCost = 0;
        const dist = fret === 0
          ? (anchorFret <= 2 ? 0 : 8 + anchorFret * 0.8)
          : Math.abs(fret - anchorFret);

        // If inside or adjacent to the hand position window [anchorFret - 1, anchorFret + 4]
        if (fret > 0 && fret >= anchorFret - 1 && fret <= anchorFret + 4) {
          baseCost += dist * 0.4;
        } else if (fret > 0) {
          baseCost += dist * 3.5;
        } else {
          baseCost += dist * 2.0;
        }

        // Penalty for high frets only if the anchor fret is low
        if (fret > 19 && anchorFret < 15) {
          baseCost += (fret - 19) * 3.0;
        }

        const isPreferred = n.preferredString === s.stringNumber;
        if (isPreferred && Math.abs(fret - anchorFret) <= 5) {
          baseCost -= 3.0;
        }
        list.push({ stringNumber: s.stringNumber, fret, cost: baseCost, isRest: false, preferred: isPreferred });
      }
    }

    if (list.length === 0) {
      // Keep the data honest: there is no physically valid fingering at this register.
      // A sentinel is used only so the DP remains total; the UI marks it unplayable.
      list.push({
        stringNumber: strings[0].stringNumber,
        fret: 0,
        cost: 100000,
        isRest: false,
        preferred: false,
      });
    }

    return list;
  });

  const dp: { cost: number; prevIndex: number }[][] = candidateLists.map(list => list.map(() => ({ cost: Infinity, prevIndex: -1 })));

  candidateLists[0].forEach((c, cIdx) => {
    dp[0][cIdx] = { cost: c.cost, prevIndex: -1 };
  });

  for (let i = 1; i < candidateLists.length; i++) {
    const prevList = candidateLists[i - 1];
    const currList = candidateLists[i];

    for (let c = 0; c < currList.length; c++) {
      const curr = currList[c];
      for (let p = 0; p < prevList.length; p++) {
        const prev = prevList[p];
        let transitionCost = 0;

        if (!prev.isRest && !curr.isRest) {
          if (prev.fret !== 0 && curr.fret !== 0) {
            const fretDiff = Math.abs(curr.fret - prev.fret);
            if (fretDiff <= 3) {
              transitionCost += fretDiff * 0.3;
            } else if (fretDiff <= 5) {
              transitionCost += 1.5 + (fretDiff - 3) * 1.8;
            } else {
              transitionCost += 10 + Math.pow(fretDiff - 4, 2) * 4.5;
            }
          } else if (prev.fret !== 0 && curr.fret === 0) {
            if (prev.fret >= 5) transitionCost += 14 + (prev.fret - 4) * 2;
          } else if (prev.fret === 0 && curr.fret !== 0) {
            if (curr.fret >= 5) transitionCost += 14 + (curr.fret - 4) * 2;
          }

          const stringDiff = Math.abs(curr.stringNumber - prev.stringNumber);
          if (stringDiff === 0) transitionCost += 0;
          else if (stringDiff === 1) transitionCost += 0.2;
          else if (stringDiff === 2) transitionCost += 1.8;
          else transitionCost += stringDiff * 3.5;
        }

        const total = dp[i - 1][p].cost + curr.cost + transitionCost;
        if (total < dp[i][c].cost) {
          dp[i][c] = { cost: total, prevIndex: p };
        }
      }
    }
  }

  let bestEndIdx = 0;
  let minEndCost = Infinity;
  const lastIndex = candidateLists.length - 1;
  for (let c = 0; c < candidateLists[lastIndex].length; c++) {
    if (dp[lastIndex][c].cost < minEndCost) {
      minEndCost = dp[lastIndex][c].cost;
      bestEndIdx = c;
    }
  }

  const chosenPath: { stringNumber: number; fret: number }[] = new Array(flatNoteEntries.length);
  let currIdx = bestEndIdx;
  for (let i = lastIndex; i >= 0; i--) {
    const chosen = candidateLists[i][currIdx];
    chosenPath[i] = { stringNumber: chosen.stringNumber, fret: chosen.fret };
    currIdx = dp[i][currIdx].prevIndex;
  }

  const nonZeroFrets = chosenPath.map(p => p.fret).filter(f => f > 0);
  const medianFret = nonZeroFrets.length > 0
    ? nonZeroFrets.slice().sort((a, b) => a - b)[Math.floor(nonZeroFrets.length / 2)]
    : anchorFret;
  const effectiveBasePos = Math.max(1, medianFret - 1);

  const output: NoteFingeringResult[][] = eventNotes.map(() => []);
  let flatIdx = 0;

  eventNotes.forEach((ev, eIdx) => {
    ev.forEach((n) => {
      const chosen = chosenPath[flatIdx];
      let finger = n.leftHandFinger;

      if (finger === undefined) {
        if (chosen.fret === 0) {
          finger = undefined;
        } else {
          const rel = chosen.fret - effectiveBasePos;
          if (rel <= 0) finger = 1;
          else if (rel === 1) finger = 2;
          else if (rel === 2) finger = 3;
          else finger = 4;
        }
      }

      output[eIdx].push({
        stringNumber: chosen.stringNumber,
        fret: chosen.fret,
        leftHandFinger: finger,
      });

      flatIdx++;
    });
  });

  return output;
}


export function formatVexFlowKey(noteName: string, octave: number): { key: string; accidental?: string } {
  let step = noteName[0].toLowerCase();
  let accidental: string | undefined = undefined;
  if (noteName.length > 1) {
    accidental = noteName.substring(1);
  }
  return {
    key: `${step}/${octave}`,
    accidental,
  };
}

export const INTERVALS_MAP = new Map([
  ['R', 0], ['b2', 1], ['2', 2], ['#2/b3', 3], ['b3', 3], ['3', 4], ['4', 5],
  ['#4', 6], ['b5', 6], ['5', 7], ['#5/b6', 8], ['#5', 8], ['b6', 8], ['6', 9],
  ['b7', 10], ['7', 11], ['8', 0], ['9', 2], ['b9', 1], ['#9', 3], ['11', 5],
  ['#11', 6], ['b13', 8], ['13', 9]
]);

export function getDynamicIntervalDegree(semitoneFromRoot: number, chordRootOffset?: number, originalDegree?: string): string {
  const pc = ((semitoneFromRoot % 12) + 12) % 12;
  const local = chordRootOffset === undefined ? pc : ((pc - chordRootOffset) % 12 + 12) % 12;
  
  if (originalDegree && INTERVALS_MAP.has(originalDegree)) {
    if (INTERVALS_MAP.get(originalDegree) === local) {
      return originalDegree;
    }
  }
  
  const FALLBACK_INTERVALS: Record<number, string> = {
    0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
  };
  return FALLBACK_INTERVALS[local] || 'R';
}

export function getEnharmonicPitch(rootName: string, semitoneFromRoot: number, intervalDegree: string | undefined, rootOctave: number, octaveOffset = 0) {
  const STEPS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const rootIndex = STEPS.indexOf(rootName.charAt(0).toUpperCase());
  if (rootIndex === -1) return { pitch: rootName, octave: rootOctave, step: rootName.charAt(0).toLowerCase(), accidental: undefined };
  
  let degreeNum = 1;
  if (intervalDegree) {
    const match = intervalDegree.match(/\d+/);
    if (match) {
      degreeNum = parseInt(match[0], 10);
      while (degreeNum > 7) degreeNum -= 7;
    }
  }
  
  const stepOffset = degreeNum - 1;
  const targetStepIndex = (rootIndex + stepOffset) % 7;
  const targetStepName = STEPS[targetStepIndex];
  
  const rootMidi = NOTE_SEMITONES[rootName];
  const targetMidi = (rootMidi + semitoneFromRoot) % 12;
  const targetStepMidi = NOTE_SEMITONES[targetStepName];
  
  let diff = targetMidi - targetStepMidi;
  while (diff > 6) diff -= 12;
  while (diff < -5) diff += 12;
  
  let accidental = '';
  if (diff === 1) accidental = '#';
  else if (diff === 2) accidental = '##';
  else if (diff === -1) accidental = 'b';
  else if (diff === -2) accidental = 'bb';
  
  const pitch = targetStepName + accidental;
  
  const absoluteMidi = (rootOctave + 1) * 12 + rootMidi + semitoneFromRoot + (octaveOffset * 12);
  let octave = Math.floor(absoluteMidi / 12) - 1;
  
  if (targetStepName === 'B' && absoluteMidi % 12 === 0) octave -= 1;
  if (targetStepName === 'B' && absoluteMidi % 12 === 1) octave -= 1;
  if (targetStepName === 'C' && absoluteMidi % 12 === 11) octave += 1;
  if (targetStepName === 'C' && absoluteMidi % 12 === 10) octave += 1;

  return { pitch, octave, step: targetStepName.toLowerCase(), accidental };
}

const ROOT_REGEX = /^([A-G][#b]?)(.*)$/;

export function transposeChordSymbol(symbol: string, semitoneShift: number): string {
  if (!symbol) return symbol;
  
  // Handle slash chords like D7/F#
  if (symbol.includes('/')) {
    const [mainChord, bassNote] = symbol.split('/');
    return `${transposeChordSymbol(mainChord, semitoneShift)}/${transposeChordSymbol(bassNote, semitoneShift)}`;
  }

  const match = symbol.match(ROOT_REGEX);
  if (!match) return symbol;

  const [, root, suffix] = match;
  const rootIndex = NOTE_SEMITONES[root];
  if (rootIndex === undefined) return symbol;

  const targetIndex = ((rootIndex + semitoneShift) % 12 + 12) % 12;
  const targetRoot = NOTE_NAMES[targetIndex];

  return `${targetRoot}${suffix}`;
}

export function transposeChordProgression(
  progression: Array<{ beat: number; symbol: string }> | undefined,
  originalRoot: string,
  targetRoot: string
): Array<{ beat: number; symbol: string }> | undefined {
  if (!progression || progression.length === 0) return undefined;
  const origMidi = NOTE_SEMITONES[originalRoot] ?? 0;
  const targetMidi = NOTE_SEMITONES[targetRoot] ?? 0;
  const shift = ((targetMidi - origMidi) % 12 + 12) % 12;
  if (shift === 0) return progression;

  return progression.map(item => ({
    beat: item.beat,
    symbol: transposeChordSymbol(item.symbol, shift),
  }));
}


import curatedData from './curatedExercises.json';
import { ExerciseItem, VariationType } from '../types';
import { NOTE_NAMES } from '../utils/musicTheory';

const DURATIONS = new Set(['w','h','q','8','16','32','64','w.','h.','q.','8.','16.','32.','hd','qd','8d','16d','32d','wr','hr','qr','8r','16r','32r']);
const VARIATION_TYPES = new Set<VariationType>([
  'base','foundational','variation','rhythmic','rhythmic-variation','rhythmic-variant','phrase','phrase-variant','accent','displacement','syncopation','anticipation','subdivision','meter','clave','clave-variant','harmonic','harmonic-variation','harmonic-variant','melodic','melodic-variation','melodic-variant','interval','register','register-variation','register-variant','position','positional-variation','position-variant','voicing','inversion','arpeggio','articulation','articulation-variation','technique','technique-variant','instrument','instrument-variation','instrument-variant','role','role-variant','orchestration','call-response','application','advanced-application','style-application','stylistic-variation','extension','combination','combination-of','contrast','contrast-to','derived','derivation','derived-from','variation-of','application-of','alternative','exact-duplicate','concept-duplicate','key-variant','orientation-variant','complement','permutation','etude'
]);

function assertExerciseData(value: unknown): asserts value is ExerciseItem[] {
  if (!Array.isArray(value)) throw new Error('curatedExercises.json must contain an array');
  const ids = new Set<string>();
  for (const [index, raw] of value.entries()) {
    const x = raw as Partial<ExerciseItem>;
    const id = typeof x.id === 'string' ? x.id : `record[${index}]`;
    if (!x.id || ids.has(x.id)) throw new Error(`${id}: missing or duplicate id`);
    ids.add(x.id);
    if (!x.title || !x.instrument || !x.atlas || !x.timeSignature || !x.events?.length) throw new Error(`${id}: incomplete exercise record`);
    if (x.instrument !== 'bass' && x.instrument !== 'guitar') throw new Error(`${id}: invalid instrument`);
    if (!Array.isArray(x.librarySections) || !x.librarySections.includes('instrument-exercises')) throw new Error(`${id}: missing instrument-exercises library section`);
    if (!Array.isArray(x.targetProfiles) || x.targetProfiles.length === 0) throw new Error(`${id}: missing targetProfiles`);
    if (x.variationType && !VARIATION_TYPES.has(x.variationType as VariationType)) throw new Error(`${id}: unsupported variationType ${x.variationType}`);
    const flattened: unknown[] = [];
    let previous = -Infinity;
    for (const [eventIndex, event] of x.events.entries()) {
      if (!Number.isFinite(event.startBeat) || event.startBeat < 0 || event.startBeat < previous) throw new Error(`${id}: invalid event ordering at ${eventIndex}`);
      previous = event.startBeat;
      if (!DURATIONS.has(event.duration)) throw new Error(`${id}: unsupported event duration ${event.duration}`);
      if (!event.notes?.length) throw new Error(`${id}: empty event ${eventIndex}`);
      for (const note of event.notes) {
        if (note.duration !== event.duration) throw new Error(`${id}: note/event duration mismatch at ${eventIndex}`);
        if (!Number.isInteger(note.semitoneFromRoot) || note.semitoneFromRoot < 0 || note.semitoneFromRoot > 11) throw new Error(`${id}: non-normalized pitch class`);
        if (!Number.isInteger(note.octaveOffset)) throw new Error(`${id}: invalid octaveOffset`);
        flattened.push(note);
      }
    }
    if (JSON.stringify(flattened) !== JSON.stringify(x.notes || [])) throw new Error(`${id}: notes/event representation drift`);
    for (const key of x.playableKeys || []) if (!NOTE_NAMES.includes(key)) throw new Error(`${id}: invalid playable key ${key}`);
  }
}

assertExerciseData(curatedData);
export const CURATED_EXERCISES = curatedData;

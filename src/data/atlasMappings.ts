import { ExerciseItem, InstrumentType } from '../types';
import { INSTRUMENT_EXERCISE_GROUPS } from './taxonomy';

export { INSTRUMENT_EXERCISE_GROUPS };

/** Theory is intentionally part of the normal instrument exercise library. */
export function getTheoryExercises(exercises: ExerciseItem[], instrument: InstrumentType, subcategory = 'Theory Applications') {
  return exercises.filter(e => e.instrument === instrument && e.instrumentExerciseCategory === 'Fretboard & Harmony' && e.instrumentExerciseSubcategory === subcategory);
}

export function getInstrumentExerciseMap(exercises: ExerciseItem[], instrument: InstrumentType) {
  const result = new Map<string, Map<string, ExerciseItem[]>>();
  for (const e of exercises) {
    if (e.instrument !== instrument || !e.instrumentExerciseCategory) continue;
    const cat = e.instrumentExerciseCategory;
    const sub = e.instrumentExerciseSubcategory || 'Other';
    if (!result.has(cat)) result.set(cat, new Map());
    const subs = result.get(cat)!;
    if (!subs.has(sub)) subs.set(sub, []);
    subs.get(sub)!.push(e);
  }
  return result;
}

export function isInstrumentExercise(e: ExerciseItem) {
  return e.librarySections?.includes('instrument-exercises') ?? false;
}

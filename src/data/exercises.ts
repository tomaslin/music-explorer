import { CURATED_EXERCISES } from './curatedExercises';

export { CURATED_EXERCISES };
export const ALL_BASS_EXERCISES = CURATED_EXERCISES.filter(e => e.instrument === 'bass');
export const ALL_GUITAR_EXERCISES = CURATED_EXERCISES.filter(e => e.instrument === 'guitar');
export const ALL_EXERCISES = CURATED_EXERCISES;

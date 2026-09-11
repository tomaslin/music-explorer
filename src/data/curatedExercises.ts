import type { ExerciseItem } from '../types';
import DATA_0 from './bass/acoustic_fingerstyle.json';
import DATA_1 from './bass/african.json';
import DATA_2 from './bass/american_roots.json';
import DATA_3 from './bass/blues.json';
import DATA_4 from './bass/brazilian.json';
import DATA_5 from './bass/caribbean_creole.json';
import DATA_6 from './bass/flamenco.json';
import DATA_7 from './bass/fretboard_harmony.json';
import DATA_8 from './bass/funk_r_b.json';
import DATA_9 from './bass/jazz.json';
import DATA_10 from './bass/latin.json';
import DATA_11 from './bass/metal.json';
import DATA_12 from './bass/synthetic.json';
import DATA_13 from './bass/tango.json';
import DATA_14 from './bass/world_rock.json';
import DATA_15 from './bass/world_traditions.json';
import DATA_16 from './guitar/acoustic_fingerstyle.json';
import DATA_17 from './guitar/african.json';
import DATA_18 from './guitar/american_roots.json';
import DATA_19 from './guitar/blues.json';
import DATA_20 from './guitar/brazilian.json';
import DATA_21 from './guitar/caribbean_creole.json';
import DATA_22 from './guitar/flamenco.json';
import DATA_23 from './guitar/fretboard_harmony.json';
import DATA_24 from './guitar/funk_r_b.json';
import DATA_25 from './guitar/jazz.json';
import DATA_26 from './guitar/latin.json';
import DATA_27 from './guitar/metal.json';
import DATA_28 from './guitar/synthetic.json';
import DATA_29 from './guitar/tango.json';
import DATA_30 from './guitar/world_rock.json';
import DATA_31 from './guitar/world_traditions.json';

export const CURATED_EXERCISES: ExerciseItem[] = [
  ...(DATA_0 as ExerciseItem[]),
  ...(DATA_1 as ExerciseItem[]),
  ...(DATA_2 as ExerciseItem[]),
  ...(DATA_3 as ExerciseItem[]),
  ...(DATA_4 as ExerciseItem[]),
  ...(DATA_5 as ExerciseItem[]),
  ...(DATA_6 as ExerciseItem[]),
  ...(DATA_7 as ExerciseItem[]),
  ...(DATA_8 as ExerciseItem[]),
  ...(DATA_9 as ExerciseItem[]),
  ...(DATA_10 as ExerciseItem[]),
  ...(DATA_11 as ExerciseItem[]),
  ...(DATA_12 as ExerciseItem[]),
  ...(DATA_13 as ExerciseItem[]),
  ...(DATA_14 as ExerciseItem[]),
  ...(DATA_15 as ExerciseItem[]),
  ...(DATA_16 as ExerciseItem[]),
  ...(DATA_17 as ExerciseItem[]),
  ...(DATA_18 as ExerciseItem[]),
  ...(DATA_19 as ExerciseItem[]),
  ...(DATA_20 as ExerciseItem[]),
  ...(DATA_21 as ExerciseItem[]),
  ...(DATA_22 as ExerciseItem[]),
  ...(DATA_23 as ExerciseItem[]),
  ...(DATA_24 as ExerciseItem[]),
  ...(DATA_25 as ExerciseItem[]),
  ...(DATA_26 as ExerciseItem[]),
  ...(DATA_27 as ExerciseItem[]),
  ...(DATA_28 as ExerciseItem[]),
  ...(DATA_29 as ExerciseItem[]),
  ...(DATA_30 as ExerciseItem[]),
  ...(DATA_31 as ExerciseItem[]),
].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true }) || a.id.localeCompare(b.id));


const SUPPORTED_VARIATION_TYPES = new Set([
  'base','foundational','variation','rhythmic','rhythmic-variation','rhythmic-variant','phrase','phrase-variant',
  'accent','displacement','syncopation','anticipation','subdivision','meter','clave','clave-variant','harmonic',
  'harmonic-variation','harmonic-variant','melodic','melodic-variation','melodic-variant','interval','register',
  'register-variation','register-variant','position','positional-variation','position-variant','voicing','inversion',
  'arpeggio','articulation','articulation-variation','technique','technique-variant','instrument','instrument-variation',
  'instrument-variant','role','role-variant','orchestration','call-response','application','advanced-application',
  'style-application','stylistic-variation','extension','combination','combination-of','contrast','contrast-to',
  'derived','derivation','derived-from','variation-of','application-of','alternative','exact-duplicate',
  'concept-duplicate','key-variant','orientation-variant','complement','permutation','etude','microtiming','cadence'
]);

for (const exercise of CURATED_EXERCISES) {
  if (exercise.variationType && !SUPPORTED_VARIATION_TYPES.has(exercise.variationType)) {
    throw new Error(`${exercise.id}: unsupported variationType ${exercise.variationType}`);
  }
}

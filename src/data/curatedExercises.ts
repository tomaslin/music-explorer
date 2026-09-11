import type { ExerciseItem } from '../types';
import BASS_SYNTHETIC from './bass/synthetic.json';
import BASS_TANGO from './bass/tango.json';
import GUITAR_TANGO from './guitar/tango.json';
import GUITAR_FLAMENCO from './guitar/flamenco.json';
import BASS_WORLD_ROCK from './bass/world-rock.json';
import BASS_LATIN_MUSIC from './bass/latin-music.json';
import GUITAR_WORLD_ROCK from './guitar/world-rock.json';
import GUITAR_LATIN_MUSIC from './guitar/latin-music.json';

export const CURATED_EXERCISES: ExerciseItem[] = [
  ...(BASS_SYNTHETIC as ExerciseItem[]),
  ...(BASS_TANGO as ExerciseItem[]),
  ...(GUITAR_TANGO as ExerciseItem[]),
  ...(GUITAR_FLAMENCO as ExerciseItem[]),
  ...(BASS_WORLD_ROCK as ExerciseItem[]),
  ...(BASS_LATIN_MUSIC as ExerciseItem[]),
  ...(GUITAR_WORLD_ROCK as ExerciseItem[]),
  ...(GUITAR_LATIN_MUSIC as ExerciseItem[]),
];

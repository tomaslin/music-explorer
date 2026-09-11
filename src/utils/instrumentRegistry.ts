import { InstrumentProfile } from '../types';

const s = (stringNumber: number, noteName: string, octave: number, midi: number) => ({ stringNumber, noteName, octave, midi });

export const INSTRUMENT_PROFILES: InstrumentProfile[] = [
  { id: 'bass-4-standard', label: 'Standard (E-A-D-G)', instrument: 'bass', strings: [s(1,'G',2,43),s(2,'D',2,38),s(3,'A',1,33),s(4,'E',1,28)], maxFret: 24, description: 'E–A–D–G standard 4-string bass tuning.' },
  { id: 'bass-4-drop-d', label: 'Drop D (D-A-D-G)', instrument: 'bass', strings: [s(1,'G',2,43),s(2,'D',2,38),s(3,'A',1,33),s(4,'D',1,26)], maxFret: 24, description: 'D–A–D–G low-D 4-string drop tuning.' },
  { id: 'bass-4-half-step', label: 'Eb Standard (Eb-Ab-Db-Gb)', instrument: 'bass', strings: [s(1,'Gb',2,42),s(2,'Db',2,37),s(3,'Ab',1,32),s(4,'Eb',1,27)], maxFret: 24, description: 'Eb–Ab–Db–Gb half-step down tuning.' },
  { id: 'bass-4-drop-c', label: 'Drop C (C-G-C-F)', instrument: 'bass', strings: [s(1,'F',2,41),s(2,'C',2,36),s(3,'G',1,31),s(4,'C',1,24)], maxFret: 24, description: 'C–G–C–F low-C 4-string drop tuning.' },
  { id: 'bass-4-fretless', label: 'Fretless Standard', instrument: 'bass', strings: [s(1,'G',2,43),s(2,'D',2,38),s(3,'A',1,33),s(4,'E',1,28)], maxFret: 24, description: 'Standard 4-string fretless reference tuning.' },

  { id: 'guitar-6-standard', label: 'Standard (E-A-D-G-B-E)', instrument: 'guitar', strings: [s(1,'E',4,64),s(2,'B',3,59),s(3,'G',3,55),s(4,'D',3,50),s(5,'A',2,45),s(6,'E',2,40)], maxFret: 24, description: 'E–A–D–G–B–E standard 6-string tuning.' },
  { id: 'guitar-6-drop-d', label: 'Drop D (D-A-D-G-B-E)', instrument: 'guitar', strings: [s(1,'E',4,64),s(2,'B',3,59),s(3,'G',3,55),s(4,'D',3,50),s(5,'A',2,45),s(6,'D',2,38)], maxFret: 24, description: 'D–A–D–G–B–E drop-D tuning.' },
  { id: 'guitar-6-dadgad', label: 'DADGAD (D-A-D-G-A-D)', instrument: 'guitar', strings: [s(1,'D',4,62),s(2,'A',3,57),s(3,'G',3,55),s(4,'D',3,50),s(5,'A',2,45),s(6,'D',2,38)], maxFret: 24, description: 'D–A–D–G–A–D modal Celtic/fingerstyle tuning.' },
  { id: 'guitar-6-open-g', label: 'Open G (D-G-D-G-B-D)', instrument: 'guitar', strings: [s(1,'D',4,62),s(2,'B',3,59),s(3,'G',3,55),s(4,'D',3,50),s(5,'G',2,43),s(6,'D',2,38)], maxFret: 24, description: 'D–G–D–G–B–D open G tuning.' },
  { id: 'guitar-6-open-d', label: 'Open D (D-A-D-F#-A-D)', instrument: 'guitar', strings: [s(1,'D',4,62),s(2,'A',3,57),s(3,'F#',3,54),s(4,'D',3,50),s(5,'A',2,45),s(6,'D',2,38)], maxFret: 24, description: 'D–A–D–F#–A–D open D tuning.' },
  { id: 'guitar-6-open-e', label: 'Open E (E-B-E-G#-B-E)', instrument: 'guitar', strings: [s(1,'E',4,64),s(2,'B',3,59),s(3,'G#',3,56),s(4,'E',3,52),s(5,'B',2,47),s(6,'E',2,40)], maxFret: 24, description: 'E–B–E–G#–B–E open E blues rock tuning.' },
  { id: 'guitar-6-half-step', label: 'Eb Standard (Eb-Ab-Db-Gb-Bb-Eb)', instrument: 'guitar', strings: [s(1,'Eb',4,63),s(2,'Bb',3,58),s(3,'Gb',3,54),s(4,'Db',3,49),s(5,'Ab',2,44),s(6,'Eb',2,39)], maxFret: 24, description: 'Eb–Ab–Db–Gb–Bb–Eb half-step down tuning.' },
  { id: 'guitar-6-flamenco', label: 'Flamenco / Fingerstyle (19-fret)', instrument: 'guitar', strings: [s(1,'E',4,64),s(2,'B',3,59),s(3,'G',3,55),s(4,'D',3,50),s(5,'A',2,45),s(6,'E',2,40)], maxFret: 19, description: 'Traditional 19-fret nylon-string guitar profile for flamenco/fingerstyle.' },
];

export const INSTRUMENT_PROFILE_MAP = Object.fromEntries(INSTRUMENT_PROFILES.map(p => [p.id, p]));

export function getInstrumentProfile(profileId: string | undefined, instrument: 'bass' | 'guitar') {
  const fallback = instrument === 'bass' ? 'bass-4-standard' : 'guitar-6-standard';
  const profile = profileId ? INSTRUMENT_PROFILE_MAP[profileId] : undefined;
  return profile && profile.instrument === instrument ? profile : INSTRUMENT_PROFILE_MAP[fallback];
}

export function getProfilesForInstrument(instrument: 'bass' | 'guitar') {
  return INSTRUMENT_PROFILES.filter(p => p.instrument === instrument);
}

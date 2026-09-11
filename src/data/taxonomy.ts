/** Exercise-only atlas taxonomy. Every child corresponds to real exercise data. */
export const GENRE_ATLAS_TREE = [
  { name: 'Synthetic Bass', children: ['Hip-Hop','Drill','Trap / 808','Funk','Reggaeton / Dembow','Latin Trap','Urbano','EDM','Dubstep','Electro','Future Bass','Techno','Acid','Industrial','Synthwave','Cyberpunk','Boogie / Electro-Funk','House','Nu-Disco','Eurodance','Drum & Bass','Jungle','UK Garage','Grime','Hyperpop','Industrial Bass','Experimental Electronics'] },
  { name: 'Tango', children: ['Arrastres, Bordoneos & Low-End Articulations','Compás Engines: Marcato, Síncopa, Yumba & 3+3+2','Percussive & Extended Techniques (Efectos Típicos)','Milonga & Vals Criollo Mechanics','Folklore Engines: Chacarera, Zamba & Chamamé','Full-Song Etudes & Stylistic Synthesis'] },
  { name: 'Flamenco', children: ['Rasgueados & Rhythmic Compás Engines','Pulgar & Alzapúa Mechanics','Picado Speed, Precision & Scales','Arpeggios, Tremolo & Legato Mechanics','Flamenco Palos Engines & Rhythm Structures','Concert Falsetas & Stylistic Synthesis'] },
  { name: 'Latin Music', children: ['Cuban Son & Montuno','Salsa','Timba','Dominican Merengue & Bachata','Cumbia','French Caribbean Zouk & Compas','Angolan Semba & Kizomba','Reggaeton & Dembow','Clave & Afro-Latin Patterns'] },
  { name: 'World Rock', children: ['East Asia','Southeast Asia','South Asia','Middle East & Anatolia','Europe','Central Asia','North America','Latin America','Oceania','Africa'] },
] as const;

export const EXERCISE_ATLASES = GENRE_ATLAS_TREE.map(x => x.name) as readonly string[];
export type ExerciseAtlas = typeof EXERCISE_ATLASES[number];
export type StyleFamily = string;

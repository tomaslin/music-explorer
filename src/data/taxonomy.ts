/** Easy-to-browse genre navigation. The four primary anchors intentionally lead the map. */
export const GENRE_ATLAS_TREE = [
  { name: 'Tango', children: ['Tango','Marcato','Síncopa','Arrastre','Yumba','Bordoneo','3+3+2','Rellenos & Cadences','Fraseo & Yeites','Guitar Effects','Bass Lines','Bass Effects','Ensemble Roles','Milonga','Vals','Tango Nuevo'] },
  { name: 'Latin', children: ['Salsa','Son Montuno','Mambo','Cha-Cha-Chá','Timba','Songo','Afro-Cuban 6/8','Merengue','Bachata','Cumbia','Guaracha','Bolero','Latin Jazz','Montuno','Reggaeton'] },
  { name: 'Flamenco', children: ['Soleá','Bulerías','Alegrías','Tangós','Farruca','Seguiriya','Fandangos','Rumba Flamenca','Tientos','Tarantos','Zapateado','Malagueñas'] },
  { name: 'Brazilian', children: ['Samba','Samba de Roda','Bossa Nova','Partido-Alto','Samba-Enredo','Pagode','Samba-Rock','Samba-Funk','Samba-Reggae','Samba-Canção','Batucada','Baião','Forró','Forró Pé-de-Serra','Forró Universitário','Forró Eletrônico','Xote','Xaxado','Arrasta-pé','Frevo','Frevo de Rua','Frevo de Bloco','Frevo-Canção','Carimbó','Lambada','Maxixe','Choro','Coco','Maracatu','Maracatu Nação','Maracatu Rural','Ijexá','Afoxé','Axé','Pagode Baiano','Piseiro / Pisadinha','Brega','Arrocha','Tecnobrega','Guitarrada','Brazilian Zouk'] },
  { name: 'Jazz', children: ['Bebop','Jazz Blues','Walking Bass','Jazz Guitar','Chord Tones','Improvisation & Soloing','Chord Melody','Swing','Jazz Waltz'] },
  { name: 'Blues', children: ['Delta Blues','Chicago Blues','Texas Blues','Slow Blues','Jump Blues','Blues Rock','Blues Bass','Boogie','Shuffle'] },
  { name: 'Funk & R&B', children: ['James Brown Funk','P-Funk','Neo-Soul','Motown','Funk Guitar','Funk Bass','Slap Bass','R&B','Disco','Go-Go','New Jack Swing'] },
  { name: 'African', children: ['West African Highlife','Palm-Wine','Afrobeat','Soukous','Congolese Rumba','Semba','Mbalax','Makossa','Bikutsi','Jùjú','Mbaqanga','Kwela','Benga','Gnawa'] },
  { name: 'Caribbean & Creole', children: ['Reggae','Dancehall','Ska','Calypso','Soca','Zouk','Kizomba','Tarraxinha / Tarraxo','Kompa','Mini-Jazz','Kompa Love','Cadence-Lypso','Zouk-Kizomba Crossover','Gwo Ka / Rock Fusion','Morna','Zydeco','Rocksteady'] },
  { name: 'American Roots', children: ['Country','Bluegrass','Rockabilly','Western Swing','New Orleans','Gospel','Appalachian','Honky-Tonk','Country Bass','Ragtime','Cajun'] },
  { name: 'World Rock', children: ['Rock en Español','Chinese Rock','Chinese Heavy Rock','Chinese Folk Metal','Chinese Progressive Metal','Chinese Extreme Metal','Taiwanese Rock','Taiwanese Metal','Taiwanese Folk Metal','J-Rock','Japanese Alternative Rock','Visual Kei','Japanese Metal','Japanese Folk Metal','Japanese Math Rock','Japanese Progressive Rock','Japanese Psychedelic / Proto-Metal','Indian Rock','Indian Progressive Metal','Carnatic Rock / Metal','Hindustani Fusion Rock','Pakistani Rock / Metal','Bangladeshi Rock / Metal','Indonesian Rock / Metal','Thai Rock / Metal','Filipino Rock / Metal','Korean Rock','Korean Metal','Mongolian / Steppe Metal','Central Asian Folk Metal','World Folk Metal','Rock','Progressive Rock','Thrash','Death Metal','Black Metal','Doom','Groove Metal','Metalcore','Progressive Metal','Djent','Sludge'] },
  { name: 'Acoustic & Fingerstyle', children: ['Travis Picking','Piedmont','Fingerstyle Blues','Chord Melody','Alternating Thumb','Percussive Fingerstyle'] },
  { name: 'World Traditions', children: ['Raga / Hindustani Guitar','Carnatic Guitar','Celtic','Klezmer','Balkan','Greek','Musette','Japanese Traditional','Indonesian / Gamelan-Inspired','Turkish / Aksak','Maqsum','Saidi'] },
] as const;

export const EXERCISE_ATLASES = GENRE_ATLAS_TREE.map(x=>x.name) as readonly string[];
export type ExerciseAtlas = typeof EXERCISE_ATLASES[number] | 'Fretboard & Harmony';
export const LIBRARY_VIEWS = ['Genre Atlases','Guitar & Bass Exercises','Books'] as const;
export type LibraryView = typeof LIBRARY_VIEWS[number];
export const INSTRUMENT_EXERCISE_GROUPS = [
  { name: 'Fretboard & Harmony', children: ['Fretboard Mapping','Chords / Voicings','Chord Tones / Voice Leading','Theory Applications'] },
  { name: 'Technique & Speed', children: ['Technique / Mechanics','Hanon / Fitness Workouts','Slap / Pop','Picking / Articulation'] },
  { name: 'Rhythm & Coordination', children: ['Groove / Time','Subdivision / Accent','Coordination / Independence'] },
  { name: 'Soloing & Improvisation', children: ['Lines / Vocabulary','Solo Construction','Jazz Variations'] },
  { name: 'Style Applications', children: ['Genre Vocabulary','Brazilian / Latin','Blues / Funk / R&B','Metal / Rock','Roots / Fingerstyle','Historical Repertoire'] }
] as const;
export const STYLE_FAMILIES = ['flamenco','tango','salsa','son-montuno','mambo','cha-cha-cha','timba','songo','merengue','bachata','cumbia','reggaeton','brazilian','samba','bossa-nova','choro','baiao','frevo','partido-alto','maracatu','ijexa','funk','slap-bass','blues','jazz','metal','world-rock','rock-en-espanol','chinese-rock','chinese-metal','taiwanese-rock','taiwanese-metal','j-rock','japanese-math-rock','japanese-metal','indian-rock','carnatic-metal','folk-metal','mongolian-metal','indonesian-metal','korean-rock','country','fingerstyle','reggae','ska','zouk','kizomba','kompa','world'] as const;
export type StyleFamily = typeof STYLE_FAMILIES[number];

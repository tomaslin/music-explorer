export interface SourceBibliographyItem {
  id: string; title: string; author: string; language?: string; sourceType: string; verificationStatus: string;
  publisher?: string; publicationYear?: number; scope?: string[];
}

export const SOURCE_BIBLIOGRAPHY: SourceBibliographyItem[] = [
  {"id":"mongolian-folk-metal","title":"Tengger Cavalry — Mongolian Folk Rock/Metal Reference","author":"Tengger Cavalry / Nature Ganganbaigal","language":"English","sourceType":"artist-reference","verificationStatus":"verified","scope":["Mongolian folk metal","throat singing","morin khuur","Central Asian instruments","folk metal"]},
  {"id":"taiwanese-rock-reference","title":"A History of Taiwanese Rock: Thirty Years from the Underground to the Mainstream","author":"Taiwan.md editorial reference","language":"English","sourceType":"music-history-reference","verificationStatus":"verified","scope":["Taiwanese rock","Taiwanese rock history","Taiwanese metal","independent rock"]},
  {"id":"chinese-rock-vernacular","title":"Modernizing Chinese Vernacular Music — From Red Songs to Rock Music","author":"Ya-Hui Cheng","language":"English","sourceType":"academic-book-chapter","verificationStatus":"verified","publisher":"Routledge","scope":["Chinese rock","Northwest Wind","Cui Jian","Chinese vernacular music"]},
  {"id":"japrocksampler","title":"Japrocksampler: How the Post-war Japanese Blew Their Minds on Rock 'n' Roll","author":"Julian Cope","language":"English","sourceType":"music-history","verificationStatus":"verified","publisher":"Bloomsbury","publicationYear":2007,"scope":["Japanese rock","Japanese progressive rock","Japanese heavy rock","post-war Japanese music"]},
  {"id":"jrock-ink","title":"Jrock, Ink: A Concise Report on 40 of the Biggest Rock Acts in Japan","author":"Josephine Yun","language":"English","sourceType":"music-reference","verificationStatus":"verified","publisher":"Stone Bridge Press","publicationYear":2005,"scope":["Japanese rock","J-rock","visual kei","Japanese metal","rock history"]},
  {"id":"cuban-timba-contemporary-bass-technique","title":"Cuban Timba: A Contemporary Bass Technique","author":"Feliciano Arango & Cherina Mastrantones","language":"English/Spanish","sourceType":"artist-method","verificationStatus":"verified","publisher":"ArangoTones","publicationYear":2009,"scope":["timba bass","tumbao","bloques","dead notes","palm slide","jazz con timba"]},


  {"id":"art-of-classical-guitar-playing","title":"The Art of Classical Guitar Playing","author":"Charles Duncan","language":"English","sourceType":"published-method","verificationStatus":"verified","publisher":"Alfred Music","publicationYear":1995,"scope":["classical guitar technique","right-hand technique","articulation","fretboard"]},
  {"id":"sor-complete-studies","title":"Fernando Sor — Complete Studies, Lessons and Exercises","author":"Fernando Sor; edited by Brian Jeffery","language":"English","sourceType":"published-etude-collection","verificationStatus":"verified","publisher":"Tecla Editions","scope":["classical guitar studies","left-hand technique","right-hand technique","phrase construction"]},
  {"id":"bach-for-guitar-schott","title":"Bach for Guitar","author":"J. S. Bach; arranged by Martin Hegel","language":"English","sourceType":"published-transcription","verificationStatus":"verified","publisher":"Schott Music","scope":["Baroque repertoire","counterpoint","arpeggiation","voice independence"]},

  {
    "id": "101-montunos",
    "title": "101 Montunos",
    "author": "Rebeca Mauleón-Santana",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "70s-funk-and-disco-bass-101",
    "title": "70s Funk and Disco Bass 101",
    "author": "Josquin des Pres",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "a-modern-method-for-guitar-vols-1-3",
    "title": "A Modern Method for Guitar: Volumes 1, 2, 3 Complete",
    "author": "William Leavitt",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "bass-bible",
    "title": "Bass Bible",
    "author": "Paul Westwood",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "bass-players-guide-scales-modes",
    "title": "The Bass Player’s Guide to Scales & Modes",
    "author": "Stuart Clayton",
    "language": "English",
    "sourceType": "published-theory",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "bassists-book-of-scales-and-arpeggios",
    "title": "The Bassist's Book of Scales and Arpeggios",
    "author": "Janek Gwizdala",
    "language": "English",
    "sourceType": "published-theory",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "building-walking-bass-lines",
    "title": "Building Walking Bass Lines",
    "author": "Ed Friedland",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "c-mo-tocar-tango-en-guitarra",
    "title": "Cómo tocar tango en guitarra",
    "author": "Ramos, Ariel E. & Botto, Mariano",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "chord-chemistry",
    "title": "Chord Chemistry",
    "author": "Ted Greene",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "complete-course-in-jazz-guitar-book-1",
    "title": "Complete Course in Jazz Guitar, Book 1",
    "author": "Mickey Baker",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "concepts-for-bass-soloing",
    "title": "Concepts for Bass Soloing",
    "author": "Chuck Sher and Marc Johnson",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "constructing-melodic-jazz-improvisation",
    "title": "Constructing Melodic Jazz Improvisation",
    "author": "Brian Kane",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "el-arte-flamenco-de-la-guitarra",
    "title": "El Arte Flamenco de la Guitarra",
    "author": "Juan Martin",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "fast-forward-metal-bass-styles",
    "title": "Fast Forward Metal Bass Styles",
    "author": "Phil Mulford",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "forward-motion",
    "title": "Forward Motion",
    "author": "Hal Galper",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "guitar-grimoire-scales-modes",
    "title": "The Guitar Grimoire: Scales & Modes",
    "author": "Adam Kadmon",
    "language": "English",
    "sourceType": "published-theory",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "guitar-patterns-for-improvisation",
    "title": "Guitar Patterns For Improvisation",
    "author": "William L Fowler",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "improvise-for-real",
    "title": "Improvise for Real",
    "author": "David Reed",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "inside-the-brazilian-rhythm-section",
    "title": "Inside the Brazilian Rhythm Section",
    "author": "Nelson Faria and Cliff Korman",
    "language": "English",
    "sourceType": "play-along-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "intervallic-improvisation",
    "title": "Intervallic Improvisation",
    "author": "Walt Weiskopf",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "jazz-guitar-single-note-soloing-volume-1",
    "title": "Jazz Guitar Single Note Soloing, Volume 1",
    "author": "Todd Greene",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "linear-expressions",
    "title": "Linear Expressions",
    "author": "Pat Martino",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "m-todo-de-guitarra-tango",
    "title": "Método de guitarra tango",
    "author": "Julián Graciano",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "modern-blues-guitar-soloing",
    "title": "Modern Blues Guitar Soloing",
    "author": "Josh Smith",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "modern-electric-bass",
    "title": "Modern Electric Bass",
    "author": "Jaco Pastorius and Jerry Jemmott",
    "language": "English",
    "sourceType": "artist-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "music-theory-for-guitarists",
    "title": "Music Theory for Guitarists: Everything You Ever Wanted to Know But Were Afraid to Ask",
    "author": "Tom Kolb",
    "language": "English",
    "sourceType": "published-theory",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "reggae-bass",
    "title": "Reggae Bass",
    "author": "Ed Friedland",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "slap-it",
    "title": "Slap It",
    "author": "Tony Oppenheim",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "standing-in-the-shadows-of-motown",
    "title": "Standing in the Shadows of Motown",
    "author": "Allan Slutsky",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "tango-bass",
    "title": "Tango Bass",
    "author": "Bucky Arcella",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "the-advancing-guitarist",
    "title": "The Advancing Guitarist",
    "author": "Mick Goodrick",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "the-brazilian-guitar-book",
    "title": "The Brazilian Guitar Book",
    "author": "Nelson Faria",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "the-guitar-style-of-django-reinhardt-and-the-gypsies",
    "title": "The Guitar Style of Django Reinhardt and the Gypsies",
    "author": "Ian Cruickshank",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "the-improvisers-bass-method-for-electric-acoustic-bass",
    "title": "The Improvisers Bass Method for Electric & Acoustic Bass",
    "author": "Chuck Sher",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "the-improvisors-path",
    "title": "The Improvisor’s Path",
    "author": "Damian Erskine",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "the-latin-bass-book",
    "title": "The Latin Bass Book",
    "author": "Oscar Stagnaro and Chuck Sher",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "triads-for-the-improvising-guitarist",
    "title": "Triads for the Improvising Guitarist",
    "author": "Jane Miller",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "bass-hanon-75-exercises-to-build-endurance-and-flexibility-for-bass-guitar-players",
    "title": "Bass Hanon 75 Exercises to Build Endurance and Flexibility for Bass Guitar Players",
    "author": "Scott Barnard",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "guitar-aerobics",
    "title": "Guitar Aerobics",
    "author": "Troy Nelson",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "brazilian-rhythms-for-solo-guitar",
    "title": "Brazilian Rhythms for Solo Guitar",
    "author": "Flavio Henrique Medeiros and Carlos Almada",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "blues-you-can-use",
    "title": "Blues You Can Use",
    "author": "John Ganapes",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "bass-guitar-exercises-for-dummies",
    "title": "Bass Guitar Exercises For Dummies",
    "author": "Patrick Pfeiffer",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "advanced-studies-for-bass-guitar",
    "title": "Advanced Studies for Bass Guitar",
    "author": "Stuart Clayton",
    "language": "English",
    "sourceType": "published-etude-collection",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "101-blues-patterns-for-bass-guitar",
    "title": "101 Blues Patterns for Bass Guitar",
    "author": "Larry McCabe",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "blues-grooves",
    "title": "Blues Grooves",
    "author": "Brian Emmel",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "funkifying-the-cl-ve",
    "title": "Funkifying the Cláve",
    "author": "Lincoln Goines & Robby Ameen",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "afro-cuban-grooves-for-bass-and-drums",
    "title": "Afro-Cuban Grooves for Bass and Drums",
    "author": "Lincoln Goines & Robby Ameen",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "how-to-play-brazilian-guitar-acoustic-book-1",
    "title": "How to Play Brazilian Guitar (Acoustic Book 1)",
    "author": "Paolo Mari",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  },
  {
    "id": "101-bass-tips-gary-willis",
    "title": "101 Bass Tips — Gary Willis",
    "author": "Gary Willis",
    "language": "English",
    "sourceType": "published-method",
    "verificationStatus": "verified-topic",
    "publisher": "See source edition",
    "scope": [
      "exercise reference"
    ]
  }
];

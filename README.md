# Guitar & Bass Exercise Atlas

A deterministic, static guitar and bass exercise atlas built with React, Vite, VexFlow and Web Audio. It is a reference/practice library rather than a linear course.

## What is included

- **Genre Atlases** — Tango, Latin, Flamenco and Brazilian are the primary anchors, followed by Jazz, Blues, Funk & R&B, African, Caribbean & Creole, American Roots, World Rock, Acoustic & Fingerstyle and World Traditions.
- **Guitar & Bass Exercises** — instrument-first views over the same exercise library.
- **Fretboard & Harmony** — playable fretboard mapping, chords/voicings, chord tones/voice leading and theory applications.
- **Historical Repertoire** — historical guitar vocabulary presented as playable studies rather than unsupported transcription claims.
- **Books** — source and bibliography information attached to the relevant exercises.

## Library

The current library contains **1,445 unique exercises**:

- 784 guitar
- 661 bass
- 824 Fretboard & Harmony records
- 58 bibliography entries
- 928 exercises with source associations

The content is stored locally in `src/data/curatedExercises.json` and is loaded into the application at build time. There is no runtime server, database, API, or AI dependency.

## Playback and notation

The application renders the same computed musical events into both notation/tab and the interactive fretboard, so playback is driven from the exact material displayed to the user.

Playback includes:

- Root/key transposition
- Instrument-aware fretboard positions
- Guitar and bass playback channels
- VexFlow standard notation plus tablature
- Event-by-event playback highlighting
- Looping
- BPM control
- Metronome and custom rhythmic patterns
- Exercise-specific feel/microtiming
- Accents, ghost notes and articulation metadata
- Web Audio fallback when the SoundFont engine is unavailable
- Optional SoundFont playback through SpessaSynth

The SoundFont processor and SoundFont are shipped in `public/` and are referenced through Vite's runtime base path, so they continue to load from a GitHub Pages repository path instead of assuming the site is hosted at `/`.

## Project structure

```text
.
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/
│   ├── spessasynth_processor.min.js
│   └── trimmed.sf2
├── src/
│   ├── components/                # UI, notation, fretboard and navigation
│   ├── data/                      # exercise library, taxonomy and bibliography
│   ├── utils/                     # deterministic music, rhythm and audio logic
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
└── vite.config.ts
```

There are deliberately no checked-in audit reports, one-off generation scripts, validation tools, backend/server files, mock data layers, or runtime AI integrations.

## Development

```bash
npm install
npm run dev
```

For a production-style local check:

```bash
npm run lint
npm run build
npm run preview
```

`dist/` is the complete static deployment artifact and is intentionally ignored by Git.

## GitHub Pages

The repository is configured for GitHub Pages through GitHub Actions. The workflow builds the Vite application and publishes `dist/` using the official Pages deployment actions.

The Vite configuration uses a relative base (`./`) so the generated static assets work whether the repository is published at the domain root or under a repository path. Runtime SoundFont assets use the same Vite base path.

In GitHub, set **Settings → Pages → Source** to **GitHub Actions**. Pushes to `main` then build and deploy the site automatically.

Vite's deployment guidance requires a repository-path-aware `base` for nested GitHub Pages deployments and a build workflow that publishes `dist`; this project uses a relative base because the application is a static, non-routed single-page app. urlVite static deployment guidancehttps://vite.dev/guide/static-deploy

## Design principles

1. **Idiomatic material over arbitrary permutations.** Exercises should represent recognizable musical roles, phrases, grooves, techniques, forms or accompaniment language.
2. **Musical context outside pure fretboard work.** Genre material should function as actual musical material rather than isolated scale demonstrations.
3. **Instrument role matters.** Bass and guitar parts are authored for their respective roles, including explicit adaptations where the original tradition is normally keyboard-, synth- or ensemble-led.
4. **Source references are contextual.** A bibliography association identifies the musical territory being studied; it does not automatically claim a note-for-note transcription.
5. **Deterministic runtime.** Exercise generation, transposition, fretboard mapping, notation and playback are local deterministic code paths.
6. **One musical source of truth.** The exercise event data feeds notation, tablature, fretboard rendering and playback rather than maintaining separate representations.

## Audio architecture

The app first creates a browser `AudioContext`. SpessaSynth is initialized opportunistically with the bundled processor and SoundFont. If that initialization is unavailable, playback falls back to a procedural Web Audio instrument, so a missing or unsupported SoundFont path does not make the exercise library unusable.

No backend is required for the application to render or play exercises.

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  InstrumentType,
  BassStringType,
  ExerciseItem,
  NoteName,
  NoteDefinition,
  Microtiming,
} from './types';
import { ALL_BASS_EXERCISES, ALL_GUITAR_EXERCISES } from './data/exercises';
import {
  noteToMidi,
  computeErgonomicExerciseFingerings,
  getEnharmonicPitch,
  getDynamicIntervalDegree,
  getDefaultRootOctaveAndAnchor,
  transposeChordProgression,
  ENHARMONIC_MAP,
} from './utils/musicTheory';
import { getProfilesForInstrument } from './utils/instrumentRegistry';
import { soundEngine, PlaybackEvent } from './utils/audioSynth';
import { ExerciseShell } from './components/layout/ExerciseShell';

export function App() {
  const [instrument, setInstrument] = useState<InstrumentType>('bass');
  const [bassStrings, setBassStrings] = useState<BassStringType>(4);
  const [profileId, setProfileId] = useState('bass-4-standard');
  const [feelOverride, setFeelOverride] = useState<Microtiming | 'exercise'>('exercise');

  const allExercises = useMemo(() => {
    return [...ALL_BASS_EXERCISES, ...ALL_GUITAR_EXERCISES];
  }, []);

  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem>(ALL_BASS_EXERCISES[0]);
  const [currentRoot, setCurrentRoot] = useState<NoteName>('C');
  const [rootOctave, setRootOctave] = useState<number>(2);
  const [anchorFret, setAnchorFret] = useState<number>(3);
  const [anchorStringNumber, setAnchorStringNumber] = useState<number>(1);
  const [bpm, setBpm] = useState<number>(80);
  const [isMetronomeActive, setIsMetronomeActive] = useState<boolean>(false);
  const [isExercisePlaying, setIsExercisePlaying] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<'intervals' | 'noteNames'>('intervals');
  const [showHandPositionBox] = useState<boolean>(true);
  const [pendingPlaybackRestart, setPendingPlaybackRestart] = useState<boolean>(false);

  // Overlay state: Navigation Map & Exercise Info
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(false);

  const profiles = useMemo(() => {
    return getProfilesForInstrument(instrument);
  }, [instrument]);

  const activeTransposedExercise = useMemo(() => {
    if (!selectedExercise.chordProgression || selectedExercise.chordProgression.length === 0) {
      return selectedExercise;
    }
    const transposed = transposeChordProgression(
      selectedExercise.chordProgression,
      selectedExercise.rootNote || 'C',
      currentRoot
    );
    return {
      ...selectedExercise,
      chordProgression: transposed,
    };
  }, [selectedExercise, currentRoot]);

  const handleInstrumentChange = (newInstrument: InstrumentType) => {
    setInstrument(newInstrument);
    const nextProfile = newInstrument === 'bass' ? 'bass-4-standard' : 'guitar-6-standard';
    setProfileId(nextProfile);
    setBassStrings(newInstrument === 'bass' ? 4 : 4);
    const list = newInstrument === 'bass' ? ALL_BASS_EXERCISES : ALL_GUITAR_EXERCISES;
    setSelectedExercise(list[0]);
    setBpm(list[0].defaultBpm);
    const { octave, anchorFret: newAnchor } = getDefaultRootOctaveAndAnchor(currentRoot, newInstrument);
    setRootOctave(octave);
    setAnchorFret(newAnchor);
    setAnchorStringNumber(newInstrument === 'bass' ? 4 : 6);
    soundEngine.stopExercise();
    soundEngine.stopMetronome();
    setIsExercisePlaying(false);
    setIsMetronomeActive(false);
    setActiveNoteIndex(null);
  };

  const handleSelectExercise = (exercise: ExerciseItem) => {
    let nextProfileId = profileId;
    if (exercise.instrument !== instrument) {
      setInstrument(exercise.instrument);
      nextProfileId = exercise.instrument === 'bass' ? 'bass-4-standard' : 'guitar-6-standard';
    }

    if (exercise.targetProfiles && exercise.targetProfiles.length > 0) {
      if (!exercise.targetProfiles.includes(nextProfileId)) {
        nextProfileId = exercise.targetProfiles[0];
      }
    }
    
    if (nextProfileId !== profileId) {
      setProfileId(nextProfileId);
    }

    // If current key is not in playableKeys, switch to first valid key
    if (exercise.playableKeys && exercise.playableKeys.length > 0) {
      if (!exercise.playableKeys.includes(currentRoot)) {
        const nextRoot = exercise.playableKeys[0] as NoteName;
        setCurrentRoot(nextRoot);
        const { octave, anchorFret: naturalAnchor } = getDefaultRootOctaveAndAnchor(nextRoot, exercise.instrument);
        setRootOctave(octave);
        setAnchorFret(naturalAnchor);
        setAnchorStringNumber(exercise.instrument === 'bass' ? 4 : 6);
      }
    }

    setSelectedExercise(exercise);
    setBpm(exercise.defaultBpm || 80);
    soundEngine.stopExercise();
    setIsExercisePlaying(false);
    setActiveNoteIndex(null);
  };

  const toggleMetronome = () => {
    if (isMetronomeActive) {
      soundEngine.stopMetronome();
      setIsMetronomeActive(false);
    } else {
      const [beatsRaw, denominatorRaw] = selectedExercise.timeSignature.split('/');
      const beats = Number(beatsRaw) || 4;
      const denominator = Number(denominatorRaw) || 4;
      soundEngine.startMetronome(bpm, beats, denominator, selectedExercise.rhythmicStructure?.customMetronomePattern);
      setIsMetronomeActive(true);
    }
  };

  const handleBpmChange = (newBpm: number) => {
    const clamped = Math.max(30, Math.min(260, newBpm));
    setBpm(clamped);
    soundEngine.updateTempo(clamped);
  };

  const computedExerciseEvents = useMemo(() => {
    const baseRootMidi = noteToMidi(currentRoot, rootOctave);

    const rawNoteMatrix = selectedExercise.events.map((event, eventIndex) =>
      event.notes.map((rawNote, noteIndex) => ({
        eventIndex,
        noteIndex,
        midi: baseRootMidi + rawNote.semitoneFromRoot + (rawNote.octaveOffset || 0) * 12,
        isRest: rawNote.isRest ?? false,
        preferredString: rawNote.preferredString,
        leftHandFinger: rawNote.leftHandFinger,
      }))
    );

    const ergonomicFingerings = computeErgonomicExerciseFingerings(
      rawNoteMatrix,
      instrument,
      bassStrings,
      anchorFret,
      profileId
    );

    return selectedExercise.events.map((event, eventIndex) => ({
      ...event,
      notes: event.notes.map((rawNote, noteIndex) => {
        const targetMidi = baseRootMidi + rawNote.semitoneFromRoot + (rawNote.octaveOffset || 0) * 12;
        const dynamicInterval = getDynamicIntervalDegree(rawNote.semitoneFromRoot, rawNote.chordRootOffset, rawNote.intervalDegree);
        const { pitch, octave, step, accidental } = getEnharmonicPitch(currentRoot, rawNote.semitoneFromRoot, dynamicInterval, rootOctave, rawNote.octaveOffset || 0);
        const fingering: { stringNumber: number; fret: number; leftHandFinger?: number } =
          ergonomicFingerings[eventIndex]?.[noteIndex] || {
            stringNumber: rawNote.preferredString || 1,
            fret: 0,
            leftHandFinger: undefined,
          };

        const isExactRootPitch = !rawNote.isRest && rawNote.semitoneFromRoot % 12 === 0 && (rawNote.octaveOffset || 0) === 0;
        const anchoredFingering = isExactRootPitch
          ? { stringNumber: anchorStringNumber, fret: anchorFret, leftHandFinger: fingering.leftHandFinger }
          : fingering;
        return {
          ...rawNote,
          midi: targetMidi,
          eventIndex,
          pitch,
          octave,
          step,
          accidental: accidental as 'b'|'#'|'n'|'##'|'bb'|undefined,
          duration: rawNote.duration,
          isRest: rawNote.isRest ?? false,
          stringNumber: anchoredFingering.stringNumber,
          fret: anchoredFingering.fret,
          intervalDegree: dynamicInterval,
          isRoot: rawNote.semitoneFromRoot % 12 === 0,
          leftHandFinger: fingering.leftHandFinger ?? rawNote.leftHandFinger,
          rightHandFinger: rawNote.rightHandFinger,
          slurToNext: rawNote.slurToNext,
          technique: rawNote.technique,
          velocity: rawNote.velocity,
          accent: rawNote.accent,
          microtiming: rawNote.microtiming,
        };
      }),
    }));
  }, [selectedExercise, currentRoot, rootOctave, anchorFret, anchorStringNumber, instrument, bassStrings, profileId]);

  const computedExerciseNotes: NoteDefinition[] = useMemo(
    () => computedExerciseEvents.flatMap((event) => event.notes as unknown as NoteDefinition[]),
    [computedExerciseEvents]
  );

  const startPlayback = useCallback(() => {
    setIsExercisePlaying(true);
    const playbackEvents: PlaybackEvent[] = computedExerciseEvents.map((event) => ({
      startBeat: event.startBeat,
      duration: event.duration,
      notes: event.notes.map((n) => ({
        midi: n.midi ?? noteToMidi(n.pitch as string, n.octave as number),
        duration: n.duration,
        isRest: n.isRest,
        velocity: n.velocity,
        accent: n.accent,
        microtiming: n.microtiming,
      })),
    }));

    const [beatsRaw] = selectedExercise.timeSignature.split('/');
    const cycleBeats = selectedExercise.cycleLengthBeats || Number(beatsRaw) || 4;

    soundEngine.playExercise(
      playbackEvents,
      bpm,
      instrument === 'bass',
      (eventIndex) => setActiveNoteIndex(eventIndex),
      () => { setIsExercisePlaying(false); setActiveNoteIndex(null); },
      feelOverride,
      isLooping,
      cycleBeats
    );
  }, [computedExerciseEvents, bpm, instrument, feelOverride, isLooping, selectedExercise]);

  useEffect(() => {
    if (pendingPlaybackRestart) {
      setPendingPlaybackRestart(false);
      startPlayback();
    }
  }, [pendingPlaybackRestart, startPlayback]);

  const handleFretClick = (noteName: string, octave: number, stringNumber: number, fret: number) => {
    const cleanNote = (ENHARMONIC_MAP[noteName] || noteName) as NoteName;
    setCurrentRoot(cleanNote);
    setRootOctave(octave);
    setAnchorFret(fret);
    setAnchorStringNumber(stringNumber);

    if (isExercisePlaying) {
      soundEngine.stopExercise();
      setActiveNoteIndex(null);
      setPendingPlaybackRestart(true);
    }
  };

  const handleRootChange = (newRoot: string) => {
    const cleanNote = (ENHARMONIC_MAP[newRoot] || newRoot) as NoteName;
    const { octave, anchorFret: newAnchor } = getDefaultRootOctaveAndAnchor(cleanNote, instrument);
    setCurrentRoot(cleanNote);
    setRootOctave(octave);
    setAnchorFret(newAnchor);
    setAnchorStringNumber(instrument === 'bass' ? 4 : 6);
    if (isExercisePlaying) {
      soundEngine.stopExercise();
      setActiveNoteIndex(null);
      setPendingPlaybackRestart(true);
    }
  };

  const togglePlayExercise = useCallback(() => {
    if (isExercisePlaying) {
      soundEngine.stopExercise();
      setIsExercisePlaying(false);
      setActiveNoteIndex(null);
    } else {
      startPlayback();
    }
  }, [isExercisePlaying, startPlayback]);

  const handleRestartExercise = useCallback(() => {
    soundEngine.stopExercise();
    setActiveNoteIndex(null);
    setIsExercisePlaying(false);
    setTimeout(() => {
      startPlayback();
    }, 25);
  }, [startPlayback]);

  useEffect(() => {
    const unsub = soundEngine.subscribeExerciseStop(() => {
      setIsExercisePlaying(false);
      setActiveNoteIndex(null);
    });
    return unsub;
  }, []);

  return (
    <ExerciseShell
      isNavOpen={isNavOpen}
      onOpenNav={() => setIsNavOpen(true)}
      onCloseNav={() => setIsNavOpen(false)}
      isInfoOpen={isInfoOpen}
      onOpenInfo={() => setIsInfoOpen(true)}
      onCloseInfo={() => setIsInfoOpen(false)}

      allExercises={allExercises}
      selectedExercise={activeTransposedExercise}
      onSelectExercise={handleSelectExercise}

      instrument={instrument}
      onInstrumentChange={handleInstrumentChange}
      bassStrings={bassStrings}
      profileId={profileId}
      onProfileChange={setProfileId}
      profiles={profiles}

      isPlaying={isExercisePlaying}
      onPlayPause={togglePlayExercise}
      onRestart={handleRestartExercise}
      isLooping={isLooping}
      onToggleLoop={() => setIsLooping(prev => !prev)}
      bpm={bpm}
      onBpmChange={handleBpmChange}
      isMetronomeActive={isMetronomeActive}
      onToggleMetronome={toggleMetronome}

      currentRoot={currentRoot}
      onRootChange={handleRootChange}
      displayMode={displayMode}
      onToggleDisplayMode={() => setDisplayMode(prev => prev === 'intervals' ? 'noteNames' : 'intervals')}
      feelOverride={feelOverride}
      onFeelChange={(f) => setFeelOverride(f as Microtiming | 'exercise')}

      computedEvents={computedExerciseEvents}
      computedNotes={computedExerciseNotes}
      activeNoteIndex={activeNoteIndex}
      anchorFret={anchorFret}
      anchorStringNumber={anchorStringNumber}
      showHandPositionBox={showHandPositionBox}
      onFretClick={handleFretClick}
    />
  );
}

export default App;

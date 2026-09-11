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
  getRootContextForExercise,
  isExercisePlayableAtRootContext,
  getPlayableRootsForExercise,
  transposeChordProgression,
  ENHARMONIC_MAP,
} from './utils/musicTheory';
import { durationToQuarterUnits } from './utils/rhythm';
import { getProfilesForInstrument, getInstrumentProfile } from './utils/instrumentRegistry';
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

  // Overlay state: Exercise Info
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
      'C',
      currentRoot
    );
    return {
      ...selectedExercise,
      chordProgression: transposed,
    };
  }, [selectedExercise, currentRoot]);

  const playableRoots = useMemo(() => getPlayableRootsForExercise(selectedExercise, profileId), [selectedExercise, profileId]);

  const stopTransport = useCallback(() => {
    soundEngine.stopExercise();
    soundEngine.stopMetronome();
    setIsExercisePlaying(false);
    setIsMetronomeActive(false);
    setActiveNoteIndex(null);
    setPendingPlaybackRestart(false);
  }, []);

  const applyMusicalContext = useCallback((root: NoteName, inst: InstrumentType, nextProfileId: string, exercise: ExerciseItem = selectedExercise) => {
    const ctx = getRootContextForExercise(exercise, root, nextProfileId);
    setCurrentRoot(root);
    setRootOctave(ctx.octave);
    setAnchorFret(ctx.anchorFret);
    setAnchorStringNumber(ctx.anchorStringNumber);
  }, [selectedExercise]);

  const handleInstrumentChange = (newInstrument: InstrumentType) => {
    const nextProfile = newInstrument === 'bass' ? 'bass-4-standard' : 'guitar-6-standard';
    const list = newInstrument === 'bass' ? ALL_BASS_EXERCISES : ALL_GUITAR_EXERCISES;
    const nextExercise = list[0];
    stopTransport();
    setInstrument(newInstrument);
    setProfileId(nextProfile);
    setBassStrings(4);
    setSelectedExercise(nextExercise);
    setBpm(nextExercise.defaultBpm || 80);
    applyMusicalContext(currentRoot, newInstrument, nextProfile, nextExercise);
  };

  const handleSelectExercise = (exercise: ExerciseItem) => {
    let nextProfileId = profileId;
    if (exercise.instrument !== instrument) nextProfileId = exercise.instrument === 'bass' ? 'bass-4-standard' : 'guitar-6-standard';
    if (exercise.targetProfiles?.length && !exercise.targetProfiles.includes(nextProfileId)) nextProfileId = exercise.targetProfiles[0];

    const allowedRoots = getPlayableRootsForExercise(exercise, nextProfileId);
    const nextRoot = allowedRoots.includes(currentRoot) ? currentRoot : (allowedRoots[0] || currentRoot);
    stopTransport();
    setInstrument(exercise.instrument);
    setProfileId(nextProfileId);
    setBassStrings(4);
    setSelectedExercise(exercise);
    setBpm(exercise.defaultBpm || 80);
    applyMusicalContext(nextRoot, exercise.instrument, nextProfileId, exercise);
  };

  const handleProfileChange = (nextProfileId: string) => {
    const roots = getPlayableRootsForExercise(selectedExercise, nextProfileId);
    const nextRoot = roots.includes(currentRoot) ? currentRoot : (roots[0] || currentRoot);
    stopTransport();
    setProfileId(nextProfileId);
    applyMusicalContext(nextRoot, instrument, nextProfileId);
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
        const profile = getInstrumentProfile(profileId, instrument);
        const isPlayable = rawNote.isRest || rawNote.isDeadNote || profile.strings.some(str => targetMidi - str.midi >= 0 && targetMidi - str.midi <= profile.maxFret);
        return {
          ...rawNote,
          midi: targetMidi,
          isPlayable,
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

    const cycleBeats = selectedExercise.cycleLengthBeats || Math.max(0, ...computedExerciseEvents.map(e => e.startBeat + durationToQuarterUnits(e.duration)));


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
    const allowed = getPlayableRootsForExercise(selectedExercise, profileId);
    if (!allowed.includes(cleanNote)) return;
    if (!isExercisePlayableAtRootContext(selectedExercise, cleanNote, octave, profileId)) return;
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
    const allowed = getPlayableRootsForExercise(selectedExercise, profileId);
    if (!allowed.includes(cleanNote)) return;
    const wasPlaying = isExercisePlaying;
    if (wasPlaying) stopTransport();
    applyMusicalContext(cleanNote, instrument, profileId);
    if (wasPlaying) setPendingPlaybackRestart(true);
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
      onProfileChange={handleProfileChange}
      profiles={profiles}
      playableRoots={playableRoots}

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

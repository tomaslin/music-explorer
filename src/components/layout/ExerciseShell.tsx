import React, { useState, useEffect, useMemo } from 'react';
import { MinimalToolbar } from '../toolbar/MinimalToolbar';
import { VexFlowScore } from '../VexFlowScore';
import { Fretboard } from '../Fretboard';
import { ExerciseInfoDrawer } from '../overlay/ExerciseInfoDrawer';
import { SettingsDialog } from '../overlay/SettingsDialog';
import {
  InstrumentType,
  BassStringType,
  ExerciseItem,
  NoteName,
  NoteDefinition,
  Microtiming,
} from '../../types';

interface RenderedEvent {
  startBeat: number;
  duration: string;
  notes: NoteDefinition[];
}

interface ExerciseShellProps {
  // Navigation & Info Drawer States
  isNavOpen?: boolean;
  onOpenNav?: () => void;
  onCloseNav?: () => void;
  isInfoOpen: boolean;
  onOpenInfo: () => void;
  onCloseInfo: () => void;

  // Data & Selection
  allExercises: ExerciseItem[];
  selectedExercise: ExerciseItem;
  onSelectExercise: (exercise: ExerciseItem) => void;

  // Instrument & Tuning
  instrument: InstrumentType;
  onInstrumentChange: (inst: InstrumentType) => void;
  bassStrings: BassStringType;
  profileId: string;
  onProfileChange: (profId: string) => void;
  profiles: { id: string; label: string }[];

  // Playback state & handlers
  isPlaying: boolean;
  onPlayPause: () => void;
  onRestart: () => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  isMetronomeActive: boolean;
  onToggleMetronome: () => void;

  // Musical Context
  currentRoot: NoteName;
  onRootChange: (root: string) => void;
  displayMode: 'intervals' | 'noteNames';
  onToggleDisplayMode: () => void;
  feelOverride: Microtiming | 'exercise';
  onFeelChange: (feel: string) => void;

  // Score & Fretboard data
  computedEvents: RenderedEvent[];
  computedNotes: NoteDefinition[];
  activeNoteIndex: number | null;
  anchorFret: number;
  anchorStringNumber: number;
  showHandPositionBox: boolean;
  onFretClick: (noteName: string, octave: number, stringNumber: number, fret: number) => void;
}

export const ExerciseShell: React.FC<ExerciseShellProps> = ({
  isInfoOpen,
  onOpenInfo,
  onCloseInfo,

  allExercises,
  selectedExercise,
  onSelectExercise,

  instrument,
  onInstrumentChange,
  bassStrings,
  profileId,
  onProfileChange,
  profiles,

  isPlaying,
  onPlayPause,
  onRestart,
  isLooping,
  onToggleLoop,
  bpm,
  onBpmChange,
  isMetronomeActive,
  onToggleMetronome,

  currentRoot,
  onRootChange,
  displayMode,
  onToggleDisplayMode,
  feelOverride,
  onFeelChange,

  computedEvents,
  computedNotes,
  activeNoteIndex,
  anchorFret,
  anchorStringNumber,
  showHandPositionBox,
  onFretClick,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [topLevelId, setTopLevelId] = useState<string>(`atlas:${selectedExercise.atlas}`);

  const instrumentExercises = useMemo(() => {
    return allExercises.filter(e => e.instrument === instrument);
  }, [allExercises, instrument]);

  useEffect(() => {
    if (topLevelId.startsWith('atlas:')) {
      const a = topLevelId.replace('atlas:', '');
      if (selectedExercise.atlas !== a) {
        setTopLevelId(`atlas:${selectedExercise.atlas}`);
      }
    } else {
      const b = topLevelId.replace('book:', '');
      if (selectedExercise.bookReference !== b && selectedExercise.sourceBookId !== b) {
        setTopLevelId(`atlas:${selectedExercise.atlas}`);
      }
    }
  }, [selectedExercise.id]);

  const handleTopLevelChange = (id: string) => {
    setTopLevelId(id);
    let firstEx: ExerciseItem | undefined;
    if (id.startsWith('book:')) {
      const bId = id.replace('book:', '');
      firstEx = instrumentExercises.find(e => (e.sourceBookId || e.bookReference) === bId);
    } else {
      const a = id.replace('atlas:', '');
      firstEx = instrumentExercises.find(e => e.atlas === a);
    }
    if (firstEx) {
      onSelectExercise(firstEx);
    }
  };

  const handleBookClick = (bookName: string) => {
    handleTopLevelChange(`book:${bookName}`);
  };

  const handleSelectRelated = (relatedId: string) => {
    const found = instrumentExercises.find(e => e.id === relatedId);
    if (found) {
      onSelectExercise(found);
    }
  };

  return (
    <div
      id="exercise-shell"
      className="w-screen h-screen flex flex-col bg-stone-950 text-stone-100 font-sans overflow-hidden select-none"
    >
      {/* 1. MinimalToolbar: Compact transport & navigation access */}
      <MinimalToolbar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInfo={onOpenInfo}
        instrument={instrument}
        onInstrumentChange={onInstrumentChange}
        currentRoot={currentRoot}
        onRootChange={onRootChange}
        bpm={bpm}
        onBpmChange={onBpmChange}
        instrumentExercises={instrumentExercises}
        selectedExercise={selectedExercise}
        onSelectExercise={onSelectExercise}
        topLevelId={topLevelId}
        onTopLevelChange={handleTopLevelChange}
        isPlaying={isPlaying}
        onPlayPause={onPlayPause}
        onRestart={onRestart}
        isLooping={isLooping}
        onToggleLoop={onToggleLoop}
        isMetronomeActive={isMetronomeActive}
        onToggleMetronome={onToggleMetronome}
      />

      {/* 2. Primary Musical Workspace: 50% Score / 50% Fretboard */}
      <main
        id="exercise-workspace"
        className="flex-1 flex flex-col min-h-0 w-full overflow-hidden"
      >
        {/* TOP: Musical Score / Notation / Timeline */}
        <section
          id="section-score-view"
          className="flex-1 min-h-[220px] w-full bg-white relative overflow-hidden flex flex-col"
          aria-label="Score view"
        >
          <VexFlowScore
            notes={computedNotes}
            events={computedEvents}
            timeSignature={selectedExercise.timeSignature}
            clef={selectedExercise.clef}
            instrument={instrument}
            bassStrings={bassStrings}
            profileId={profileId}
            activeNoteIndex={activeNoteIndex}
            exerciseTitle={`${currentRoot} ${selectedExercise.title}`}
            bookReference={selectedExercise.source?.title || selectedExercise.bookReference || selectedExercise.sourceBookId}
            onBookClick={() => handleBookClick(selectedExercise.sourceBookId || selectedExercise.bookReference || '')}
            variationType={selectedExercise.variationType}
            feelOverride={feelOverride}
            chordProgression={selectedExercise.chordProgression}
          />
        </section>

        {/* BOTTOM 50%: Interactive Fretboard */}
        <section
          id="section-fretboard-view"
          className="flex-1 min-h-0 w-full bg-stone-950 relative overflow-hidden flex flex-col border-t border-stone-800"
          aria-label="Fretboard view"
        >
          <Fretboard
            instrument={instrument}
            bassStrings={bassStrings}
            profileId={profileId}
            currentRoot={currentRoot}
            exerciseNotes={computedNotes}
            activeNoteIndex={activeNoteIndex}
            displayMode={displayMode}
            showHandPositionBox={showHandPositionBox}
            anchorFret={anchorFret}
          anchorStringNumber={anchorStringNumber}
            onFretClick={onFretClick}
          />
        </section>
      </main>

      {/* 3. OptionalOverlayLayer: Transient drawers and overlays */}
      <div id="optional-overlay-layer" className="relative z-50">
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          instrument={instrument}
          onInstrumentChange={onInstrumentChange}
          profileId={profileId}
          onProfileChange={onProfileChange}
          profiles={profiles}
          bpm={bpm}
          onBpmChange={onBpmChange}
          currentRoot={currentRoot}
          onRootChange={onRootChange}
          displayMode={displayMode}
          onToggleDisplayMode={onToggleDisplayMode}
          feelOverride={feelOverride}
          onFeelChange={onFeelChange}
        />

        {/* Exercise Info Drawer */}
        <ExerciseInfoDrawer
          isOpen={isInfoOpen}
          onClose={onCloseInfo}
          exercise={selectedExercise}
          allExercises={instrumentExercises}
          onSelectRelatedExercise={handleSelectRelated}
        />
      </div>
    </div>
  );
};

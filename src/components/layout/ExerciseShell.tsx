import React, { useEffect, useMemo, useState } from 'react';
import { Info } from 'lucide-react';
import { MinimalToolbar } from '../toolbar/MinimalToolbar';
import { VexFlowScore } from '../VexFlowScore';
import { Fretboard } from '../Fretboard';
import { ExerciseInfoDrawer } from '../overlay/ExerciseInfoDrawer';
import { SettingsDialog } from '../overlay/SettingsDialog';
import { InstrumentType, BassStringType, ExerciseItem, NoteName, NoteDefinition, Microtiming } from '../../types';
import { GENRE_ATLAS_TREE } from '../../data/taxonomy';
import { cleanExerciseHeading } from '../../utils/display';

interface RenderedEvent { startBeat:number; duration:string; notes:NoteDefinition[]; }
interface ExerciseShellProps {
  isInfoOpen:boolean; onOpenInfo:()=>void; onCloseInfo:()=>void;
  allExercises:ExerciseItem[]; selectedExercise:ExerciseItem; onSelectExercise:(exercise:ExerciseItem)=>void;
  instrument:InstrumentType; onInstrumentChange:(inst:InstrumentType)=>void; bassStrings:BassStringType;
  profileId:string; onProfileChange:(profId:string)=>void; profiles:{id:string;label:string}[]; playableRoots:NoteName[];
  isPlaying:boolean; onPlayPause:()=>void; onRestart:()=>void; isLooping:boolean; onToggleLoop:()=>void;
  bpm:number; onBpmChange:(bpm:number)=>void; isMetronomeActive:boolean; onToggleMetronome:()=>void;
  currentRoot:NoteName; onRootChange:(root:string)=>void; displayMode:'intervals'|'noteNames'; onToggleDisplayMode:()=>void;
  feelOverride:Microtiming|'exercise'; onFeelChange:(feel:string)=>void;
  computedEvents:RenderedEvent[]; computedNotes:NoteDefinition[]; activeNoteIndex:number|null;
  anchorFret:number; anchorStringNumber:number; showHandPositionBox:boolean;
  onFretClick:(noteName:string,octave:number,stringNumber:number,fret:number)=>void;
}

export const ExerciseShell:React.FC<ExerciseShellProps> = props => {
  const { allExercises, selectedExercise, onSelectExercise, instrument, instrument: currentInstrument } = props;
  const instrumentExercises = useMemo(() => allExercises.filter(e => e.instrument === currentInstrument), [allExercises, currentInstrument]);
  const atlasOrder = useMemo(() => GENRE_ATLAS_TREE.map(x => x.name).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })), []);
  const atlases = useMemo(() => atlasOrder.filter(a => instrumentExercises.some(e => e.atlas === a)), [atlasOrder, instrumentExercises]);
  const [selectedAtlas, setSelectedAtlas] = useState(selectedExercise.atlas);
  const [selectedTopic, setSelectedTopic] = useState(selectedExercise.atlas === 'Fretboard & Harmony' ? (selectedExercise.instrumentExerciseSubcategory || '') : (selectedExercise.genreSubcategory || ''));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const topics = useMemo(() => {
    if (selectedAtlas === 'Fretboard & Harmony') {
      return Array.from(new Set(instrumentExercises.filter(e => e.atlas === selectedAtlas).map(e => e.instrumentExerciseSubcategory).filter(Boolean) as string[])).sort();
    }
    const declared = GENRE_ATLAS_TREE.find(a => a.name === selectedAtlas)?.children || [];
    const present = new Set(instrumentExercises.filter(e => e.atlas === selectedAtlas).map(e => e.genreSubcategory).filter(Boolean) as string[]);
    return declared.filter(t => present.has(t));
  }, [instrumentExercises, selectedAtlas]);

  const exercises = useMemo(() => instrumentExercises
    .filter(e => {
      if (e.atlas !== selectedAtlas) return false;
      return selectedAtlas === 'Fretboard & Harmony'
        ? e.instrumentExerciseSubcategory === selectedTopic
        : e.genreSubcategory === selectedTopic;
    })
    .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true }) || a.id.localeCompare(b.id)),
    [instrumentExercises, selectedAtlas, selectedTopic]);

  useEffect(() => {
    const nextTopic = selectedExercise.atlas === 'Fretboard & Harmony'
      ? (selectedExercise.instrumentExerciseSubcategory || '')
      : (selectedExercise.genreSubcategory || '');
    if (selectedExercise.atlas !== selectedAtlas) setSelectedAtlas(selectedExercise.atlas);
    if (nextTopic !== selectedTopic) setSelectedTopic(nextTopic);
  }, [selectedExercise.id, selectedExercise.atlas, selectedExercise.genreSubcategory, selectedExercise.instrumentExerciseSubcategory]);

  useEffect(() => {
    if (!topics.includes(selectedTopic)) setSelectedTopic(topics[0] || '');
  }, [topics, selectedTopic]);

  useEffect(() => {
    if (exercises.length && !exercises.some(e => e.id === selectedExercise.id)) onSelectExercise(exercises[0]);
  }, [exercises, selectedExercise.id, onSelectExercise]);

  const handleAtlas = (atlas:string) => {
    setSelectedAtlas(atlas);
    let available:string[];
    if (atlas === 'Fretboard & Harmony') {
      available = Array.from(new Set(instrumentExercises.filter(e => e.atlas === atlas).map(e => e.instrumentExerciseSubcategory).filter(Boolean) as string[])).sort();
    } else {
      const nextTopics = GENRE_ATLAS_TREE.find(a => a.name === atlas)?.children || [];
      available = nextTopics
        .filter(t => instrumentExercises.some(e => e.atlas === atlas && e.genreSubcategory === t))
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));
    }
    const topic = available[0] || '';
    setSelectedTopic(topic);
    const first = instrumentExercises
      .filter(e => e.atlas === atlas && (atlas === 'Fretboard & Harmony' ? e.instrumentExerciseSubcategory === topic : e.genreSubcategory === topic))
      .sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base', numeric: true }) || a.id.localeCompare(b.id))[0];
    if (first) onSelectExercise(first);
  };
  const handleTopic = (topic:string) => {
    setSelectedTopic(topic);
    const first = instrumentExercises.find(e => e.atlas === selectedAtlas && (selectedAtlas === 'Fretboard & Harmony' ? e.instrumentExerciseSubcategory === topic : e.genreSubcategory === topic));
    if (first) onSelectExercise(first);
  };

  const title = cleanExerciseHeading(selectedExercise.title);
  const topic = cleanExerciseHeading(selectedExercise.atlas === 'Fretboard & Harmony' ? (selectedExercise.instrumentExerciseSubcategory || selectedExercise.atlas) : (selectedExercise.genreSubcategory || selectedExercise.atlas));
  const instructions = selectedExercise.description || selectedExercise.focus || 'Play the phrase steadily, then repeat while preserving the stated rhythmic and stylistic character.';

  return <div id="exercise-shell" className="w-screen h-screen flex flex-col bg-stone-950 text-stone-100 font-sans overflow-hidden select-none">
    <header className="shrink-0 bg-stone-950 border-b border-stone-800 z-30">
      <div className="mx-auto max-w-[1800px] px-4 sm:px-6 py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Genre</span>
            <select value={selectedAtlas} onChange={e => handleAtlas(e.target.value)} className="w-full appearance-none bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-300 focus:outline-none focus:border-amber-500">
              {atlases.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Subcategory</span>
            <select value={selectedTopic} onChange={e => handleTopic(e.target.value)} className="w-full appearance-none bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-100 focus:outline-none focus:border-amber-500">
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-[0.18em] text-stone-500">Exercise</span>
            <select value={selectedExercise.id} onChange={e => { const found=exercises.find(x=>x.id===e.target.value); if(found) onSelectExercise(found); }} className="w-full appearance-none bg-stone-900 border border-stone-700 rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-100 focus:outline-none focus:border-amber-500">
              {exercises.map(ex => <option key={ex.id} value={ex.id}>{cleanExerciseHeading(ex.title)}</option>)}
            </select>
          </label>
        </div>
      </div>
    </header>

    <section className="shrink-0 bg-stone-900 border-b border-stone-800 px-4 sm:px-6 py-4">
      <div className="mx-auto max-w-[1800px] flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-white truncate">{title}</h1>
          <div className="mt-1 text-sm font-semibold text-amber-400">{topic}</div>
          <div className="mt-2 max-w-4xl text-sm leading-6 text-stone-300"><span className="text-[10px] uppercase tracking-[0.18em] text-stone-500 mr-2">Instructions</span>{instructions}</div>
        </div>
        <button onClick={props.onOpenInfo} aria-label="Exercise information" className="shrink-0 p-2.5 rounded-xl border border-stone-700 bg-stone-950 text-stone-400 hover:text-white hover:bg-stone-800"><Info className="w-4 h-4"/></button>
      </div>
    </section>

    <main id="exercise-workspace" className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
      <section id="section-score-view" className="flex-1 min-h-[220px] w-full bg-white relative overflow-hidden flex flex-col" aria-label="Score view">
        <VexFlowScore notes={props.computedNotes} events={props.computedEvents} timeSignature={selectedExercise.timeSignature} clef={selectedExercise.clef} instrument={instrument} bassStrings={props.bassStrings} profileId={props.profileId} activeNoteIndex={props.activeNoteIndex} exerciseTitle={`${props.currentRoot} ${title}`} bookReference={selectedExercise.sourceReferenceType === 'reference-context' ? selectedExercise.bookReference : (selectedExercise.source?.title || selectedExercise.bookReference || selectedExercise.sourceBookId)} sourceReferenceType={selectedExercise.sourceReferenceType} onBookClick={() => {}} variationType={selectedExercise.variationType} feelOverride={props.feelOverride} chordProgression={selectedExercise.chordProgression}/>
      </section>
      <section id="section-fretboard-view" className="flex-1 min-h-0 w-full bg-stone-950 relative overflow-hidden flex flex-col border-t border-stone-800" aria-label="Fretboard view">
        <Fretboard instrument={instrument} bassStrings={props.bassStrings} profileId={props.profileId} currentRoot={props.currentRoot} exerciseNotes={props.computedNotes} activeNoteIndex={props.activeNoteIndex} displayMode={props.displayMode} showHandPositionBox={props.showHandPositionBox} anchorFret={props.anchorFret} anchorStringNumber={props.anchorStringNumber} onFretClick={props.onFretClick}/>
      </section>
    </main>

    <MinimalToolbar onOpenSettings={()=>setIsSettingsOpen(true)} instrument={instrument} isPlaying={props.isPlaying} onPlayPause={props.onPlayPause} onRestart={props.onRestart} isLooping={props.isLooping} onToggleLoop={props.onToggleLoop} isMetronomeActive={props.isMetronomeActive} onToggleMetronome={props.onToggleMetronome} bpm={props.bpm} onBpmChange={props.onBpmChange}/>

    <div className="relative z-50">
      <SettingsDialog isOpen={isSettingsOpen} onClose={()=>setIsSettingsOpen(false)} instrument={instrument} onInstrumentChange={props.onInstrumentChange} profileId={props.profileId} onProfileChange={props.onProfileChange} profiles={props.profiles} playableRoots={props.playableRoots} bpm={props.bpm} onBpmChange={props.onBpmChange} currentRoot={props.currentRoot} onRootChange={props.onRootChange} displayMode={props.displayMode} onToggleDisplayMode={props.onToggleDisplayMode} feelOverride={props.feelOverride} onFeelChange={props.onFeelChange}/>
      <ExerciseInfoDrawer isOpen={props.isInfoOpen} onClose={props.onCloseInfo} exercise={selectedExercise} allExercises={instrumentExercises} onSelectRelatedExercise={id=>{const found=instrumentExercises.find(e=>e.id===id); if(found) onSelectExercise(found);}}/>
    </div>
  </div>;
};

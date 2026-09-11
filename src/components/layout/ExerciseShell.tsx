import React, { useEffect, useMemo, useState } from 'react';
import { MinimalToolbar } from '../toolbar/MinimalToolbar';
import { VexFlowScore } from '../VexFlowScore';
import { Fretboard } from '../Fretboard';
import { SettingsDialog } from '../overlay/SettingsDialog';
import { InstrumentType, BassStringType, ExerciseItem, NoteName, NoteDefinition } from '../../types';
import { GENRE_ATLAS_TREE } from '../../data/taxonomy';
import { cleanExerciseHeading } from '../../utils/display';

interface RenderedEvent { startBeat:number; duration:string; notes:NoteDefinition[]; }
interface ExerciseShellProps {
  allExercises:ExerciseItem[]; selectedExercise:ExerciseItem; onSelectExercise:(exercise:ExerciseItem)=>void;
  instrument:InstrumentType; onInstrumentChange:(inst:InstrumentType)=>void; bassStrings:BassStringType;
  profileId:string; playableRoots:NoteName[];
  isPlaying:boolean; onPlayPause:()=>void; onRestart:()=>void; isLooping:boolean; onToggleLoop:()=>void;
  bpm:number; onBpmChange:(bpm:number)=>void; isMetronomeActive:boolean; onToggleMetronome:()=>void;
  currentRoot:NoteName; onRootChange:(root:string)=>void; displayMode:'intervals'|'noteNames'; onToggleDisplayMode:()=>void;
  computedEvents:RenderedEvent[]; computedNotes:NoteDefinition[]; activeNoteIndex:number|null;
  anchorFret:number; anchorStringNumber:number;
  onFretClick:(noteName:string,octave:number,stringNumber:number,fret:number)=>void;
}

const ATLAS_ORDER = ['Synthetic Bass','Tango','Flamenco','Latin Music','World Rock'];
const WORLD_ROCK_REGION_ORDER = ['East Asia','Southeast Asia','South Asia','Middle East & Anatolia','Europe','Central Asia','North America','Latin America','Oceania','Africa'];

function worldRockBrowseTopic(exercise: ExerciseItem, atlasExercises: ExerciseItem[]) {
  if (exercise.atlas !== 'World Rock') return exercise.genreSubcategory || '';
  const country = exercise.genreSubcategory || '';
  const count = atlasExercises.filter(e => e.genreSubcategory === country).length;
  return count >= 2 ? country : (exercise.genreParent || 'Other');
}

const optionClass = 'w-full appearance-none bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-3 text-sm sm:text-base font-semibold text-stone-100 shadow-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30';

export const ExerciseShell:React.FC<ExerciseShellProps> = props => {
  const { allExercises, selectedExercise, onSelectExercise, instrument } = props;
  const instrumentExercises = useMemo(() => allExercises.filter(e => e.instrument === instrument), [allExercises, instrument]);
  const atlases = useMemo(() => {
    // Build the Atlas menu from the canonical taxonomy first, then append any
    // data-backed atlas that is not yet represented there. This prevents a
    // partial/legacy filter from silently hiding a loaded catalog.
    const present = new Set(instrumentExercises.map(e => e.atlas).filter(Boolean));
    const canonical = GENRE_ATLAS_TREE.map(a => a.name).filter(a => present.has(a));
    const extras = [...present].filter(a => !canonical.includes(a)).sort((a,b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true })
    );
    return [...canonical, ...extras];
  }, [instrumentExercises]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const selectedAtlas = selectedExercise.atlas;
  const selectedTopic = worldRockBrowseTopic(selectedExercise, instrumentExercises.filter(e => e.atlas === selectedAtlas));

  const topicOptions = useMemo(() => {
    const atlasExercises = instrumentExercises.filter(e => e.atlas === selectedAtlas);
    if (selectedAtlas !== 'World Rock') {
      const atlas = GENRE_ATLAS_TREE.find(a => a.name === selectedAtlas);
      const present = [...new Set(
        atlasExercises.map(e => e.genreSubcategory).filter(Boolean) as string[]
      )];
      // Prefer the canonical taxonomy order, but never hide a data-backed topic
      // simply because taxonomy.ts has not been updated for it yet.
      const canonical = (atlas?.children || []).filter(t => present.includes(t));
      const extras = present
        .filter(t => !canonical.includes(t))
        .sort((a,b) => a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true }));
      return [...canonical, ...extras].map(value => ({value,label:value,group:''}));
    }
    const counts = new Map<string, number>();
    atlasExercises.forEach(e => { const c=e.genreSubcategory || ''; counts.set(c,(counts.get(c)||0)+1); });
    const singletonByRegion = new Map<string,string[]>();
    const multi:{region:string;value:string}[]=[];
    for (const [country,count] of counts) {
      const sample=atlasExercises.find(e=>e.genreSubcategory===country);
      const region=sample?.genreParent || 'Other';
      if (count>=2) multi.push({region,value:country});
      else { const list=singletonByRegion.get(region)||[]; list.push(country); singletonByRegion.set(region,list); }
    }
    const options=[
      ...WORLD_ROCK_REGION_ORDER.filter(r=>singletonByRegion.has(r)).map(r=>({value:r,label:r,group:r})),
      ...multi.map(x=>({value:x.value,label:x.value,group:x.region}))
    ];
    const rank=new Map(WORLD_ROCK_REGION_ORDER.map((r,i)=>[r,i]));
    return options.sort((a,b)=>(rank.get(a.group)??999)-(rank.get(b.group)??999)||a.group.localeCompare(b.group)||a.label.localeCompare(b.label,undefined,{numeric:true,sensitivity:'base'}));
  }, [instrumentExercises, selectedAtlas]);
  const topics = topicOptions.map(x => x.value);

  const exercises = useMemo(() => {
    const atlasExercises=instrumentExercises.filter(e=>e.atlas===selectedAtlas);
    return atlasExercises.filter(e=>worldRockBrowseTopic(e,atlasExercises)===selectedTopic)
      .sort((a,b)=>cleanExerciseHeading(a.title).localeCompare(cleanExerciseHeading(b.title),undefined,{numeric:true,sensitivity:'base'})||a.id.localeCompare(b.id));
  }, [instrumentExercises,selectedAtlas,selectedTopic]);

  const firstExerciseFor=(atlas:string,topic?:string)=>{
    const candidates=instrumentExercises.filter(e=>e.atlas===atlas);
    const opts=atlas==='World Rock'
      ? (()=>{ const counts=new Map<string,number>(); candidates.forEach(e=>{const c=e.genreSubcategory||'';counts.set(c,(counts.get(c)||0)+1)}); const byRegion=new Map<string,string[]>(); const multi:string[]=[]; for(const [c,n] of counts){const r=candidates.find(e=>e.genreSubcategory===c)?.genreParent||'Other'; if(n>=2)multi.push(c); else {const a=byRegion.get(r)||[];a.push(c);byRegion.set(r,a)}} return [...WORLD_ROCK_REGION_ORDER.filter(r=>byRegion.has(r)),...multi.sort()]; })()
      : (GENRE_ATLAS_TREE.find(a=>a.name===atlas)?.children||[]).filter(t=>candidates.some(e=>e.genreSubcategory===t));
    const next=topic && opts.includes(topic)?topic:(opts[0]||'');
    return candidates.filter(e=>worldRockBrowseTopic(e,candidates)===next).sort((a,b)=>cleanExerciseHeading(a.title).localeCompare(cleanExerciseHeading(b.title),undefined,{numeric:true,sensitivity:'base'})||a.id.localeCompare(b.id))[0];
  };
  const handleAtlas=(atlas:string)=>{const first=firstExerciseFor(atlas);if(first)onSelectExercise(first)};
  const handleTopic=(topic:string)=>{const first=firstExerciseFor(selectedAtlas,topic);if(first)onSelectExercise(first)};

  return (
    <div id="exercise-shell" className="w-screen h-screen flex flex-col bg-stone-950 text-stone-100 font-sans overflow-hidden select-none">
      <header className="shrink-0 bg-stone-950 border-b border-stone-800 z-30">
        <div className="w-full px-2 sm:px-3 py-2 overflow-x-auto hide-scrollbar">
          <div className="flex flex-nowrap gap-2 items-center min-w-max">
            <div className="flex items-center gap-1 shrink-0">
              {(['guitar','bass'] as InstrumentType[]).map(inst => (
                <button key={inst} onClick={() => props.onInstrumentChange(inst)}
                  className={`px-3.5 py-2.5 rounded-lg border text-sm font-bold transition-colors whitespace-nowrap ${instrument === inst ? 'bg-amber-500 text-stone-950 border-amber-400' : 'bg-stone-900 text-stone-300 border-stone-700 hover:bg-stone-800 hover:text-white'}`}
                  aria-pressed={instrument === inst}>
                  {inst === 'guitar' ? 'Guitar' : 'Bass'}
                </button>
              ))}
            </div>
            <select value={selectedAtlas} onChange={e => handleAtlas(e.target.value)} className={`${optionClass} w-[190px] sm:w-[240px] shrink-0`} aria-label="Atlas">
              {atlases.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <select value={selectedTopic} onChange={e => handleTopic(e.target.value)} className={`${optionClass} w-[220px] sm:w-[300px] shrink-0`} aria-label="Topic">
              {topics.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={selectedExercise.id} onChange={e => { const found = exercises.find(x => x.id === e.target.value); if (found) onSelectExercise(found); }} className={`${optionClass} w-[280px] sm:w-[420px] shrink-0 text-amber-300`} aria-label="Exercise">
              {exercises.map(ex => <option key={ex.id} value={ex.id}>{cleanExerciseHeading(ex.title)}</option>)}
            </select>
          </div>
        </div>
      </header>

      <main id="exercise-workspace" className="flex-1 flex flex-col min-h-0 w-full overflow-hidden">
        <section id="section-score-view" className="flex-1 min-h-[220px] w-full bg-white relative overflow-hidden flex flex-col" aria-label="Score view">
          <VexFlowScore
            notes={props.computedNotes}
            events={props.computedEvents}
            timeSignature={selectedExercise.timeSignature}
            clef={selectedExercise.clef}
            instrument={instrument}
            bassStrings={props.bassStrings}
            profileId={props.profileId}
            activeNoteIndex={props.activeNoteIndex}
              chordProgression={selectedExercise.chordProgression}
          />
        </section>
        <section id="section-fretboard-view" className="flex-1 min-h-0 w-full bg-stone-950 relative overflow-hidden flex flex-col border-t border-stone-800" aria-label="Fretboard view">
          <Fretboard
            instrument={instrument}
            bassStrings={props.bassStrings}
            profileId={props.profileId}
            currentRoot={props.currentRoot}
            exerciseNotes={props.computedNotes}
            activeNoteIndex={props.activeNoteIndex}
            displayMode={props.displayMode}
            anchorFret={props.anchorFret}
            anchorStringNumber={props.anchorStringNumber}
            onFretClick={props.onFretClick}
          />
        </section>
      </main>

      <MinimalToolbar
        onOpenSettings={()=>setIsSettingsOpen(true)}
        isPlaying={props.isPlaying}
        onPlayPause={props.onPlayPause}
        onRestart={props.onRestart}
        isLooping={props.isLooping}
        onToggleLoop={props.onToggleLoop}
        isMetronomeActive={props.isMetronomeActive}
        onToggleMetronome={props.onToggleMetronome}
        bpm={props.bpm}
        onBpmChange={props.onBpmChange}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={()=>setIsSettingsOpen(false)}
        playableRoots={props.playableRoots}
        bpm={props.bpm}
        onBpmChange={props.onBpmChange}
        currentRoot={props.currentRoot}
        onRootChange={props.onRootChange}
        displayMode={props.displayMode}
        onToggleDisplayMode={props.onToggleDisplayMode}
      />
    </div>
  );
};

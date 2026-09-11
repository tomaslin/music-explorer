import React, { useEffect } from 'react';
import { X, BookOpen, Info, Target, Layers, ArrowRight } from 'lucide-react';
import { ExerciseItem } from '../../types';
import { SOURCE_BIBLIOGRAPHY } from '../../data/sourceBibliography';
import { getVariationInfo, getExerciseFamilyContext } from '../../utils/variations';

interface ExerciseInfoDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseItem;
  allExercises?: ExerciseItem[];
  onSelectRelatedExercise?: (exerciseId: string) => void;
}

export const ExerciseInfoDrawer: React.FC<ExerciseInfoDrawerProps> = ({ isOpen, onClose, exercise, allExercises = [], onSelectRelatedExercise }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape' && isOpen) onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const varInfo = getVariationInfo(exercise.variationType);
  const familyContext = getExerciseFamilyContext(exercise, allExercises);
  const source = exercise.source || SOURCE_BIBLIOGRAPHY.find(s => s.id === exercise.sourceBookId) as any;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150" role="dialog" aria-modal="true" aria-label="Exercise Information" onClick={onClose}>
      <div className="w-full sm:w-[480px] h-full bg-stone-900 border-l border-stone-800 shadow-2xl flex flex-col text-stone-100 overflow-hidden" onClick={e=>e.stopPropagation()}>
        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-stone-800 bg-stone-900/90">
          <div className="flex items-center gap-2"><Info className="w-4 h-4 text-amber-400"/><span className="font-semibold text-sm text-white font-serif">Exercise Information</span></div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white"><X className="w-4 h-4"/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-amber-400 uppercase tracking-wider mb-1">
              <span>{exercise.instrument.toUpperCase()}</span><span>•</span><span>{exercise.atlas}</span><span>•</span><span>{exercise.timeSignature}</span>
            </div>
            <h3 className="text-lg font-bold font-serif text-stone-100">{exercise.title}</h3>
            {exercise.musicalRole && <p className="text-xs text-amber-200/80 font-mono mt-0.5">{exercise.musicalRole}</p>}
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 mb-1.5 font-semibold"><Target className="w-3.5 h-3.5 text-amber-400"/><span>Exercise</span></div>
            <p className="text-xs text-stone-200 leading-relaxed">{exercise.focus}</p>
            {exercise.description && exercise.description !== exercise.focus && <p className="text-xs text-stone-400 mt-2 leading-relaxed">{exercise.description}</p>}
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold"><Layers className="w-3.5 h-3.5 text-amber-400"/><span>Pattern Variation</span></div>{exercise.variationType && <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-stone-700 text-stone-300">{varInfo.label}</span>}</div>
            {familyContext.hasFamily && familyContext.familyMembers.length > 1 && <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1"><div className="text-[10px] text-stone-500 font-mono mb-2">{familyContext.familyMembers.length} related patterns</div>{familyContext.familyMembers.map(member=>{const current=member.id===exercise.id; return <button key={member.id} disabled={current} onClick={()=>onSelectRelatedExercise?.(member.id)} className={`w-full text-left p-2 rounded-lg border text-xs flex items-center justify-between ${current?'bg-amber-500/10 border-amber-500/40 text-amber-200':'bg-stone-900/90 hover:bg-stone-800 border-stone-800 text-stone-300'}`}><span className="truncate">{member.title}</span>{!current&&<ArrowRight className="w-3 h-3 text-stone-500"/>}</button>})}</div>}
          </div>

          <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-stone-400 mb-2 font-semibold"><BookOpen className="w-3.5 h-3.5 text-amber-400"/><span>Source Book</span></div>
            {source ? <><div className="text-sm font-semibold text-stone-100">{source.title}</div><div className="text-xs text-stone-500 mt-0.5">{source.author}</div></> : <div className="text-xs text-stone-500">{exercise.bookReference || 'Source not specified'}</div>}
          </div>

          {(exercise.styleTags?.length || exercise.techniqueTags?.length || exercise.conceptTags?.length || exercise.rhythmTags?.length) ? <div className="space-y-3">
            {(['styleTags','techniqueTags','conceptTags','rhythmTags'] as const).map(key=>exercise[key]?.length ? <div key={key}><span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 block mb-1.5">{key.replace('Tags','')}</span><div className="flex flex-wrap gap-1.5">{exercise[key]!.map(t=><span key={t} className="px-2 py-0.5 rounded-md bg-stone-800 text-stone-300 text-[10px] font-mono border border-stone-700/60">{t}</span>)}</div></div>:null)}
          </div>:null}
        </div>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { Search, X, BookOpen, RotateCcw, Play, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { ExerciseItem, InstrumentType } from '../../types';
import { GENRE_ATLAS_TREE, INSTRUMENT_EXERCISE_GROUPS, LibraryView } from '../../data/taxonomy';
import { getVariationInfo } from '../../utils/variations';

interface NavigationMapDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  allExercises: ExerciseItem[];
  selectedExerciseId: string;
  onSelectExercise: (exercise: ExerciseItem) => void;
  currentInstrument: InstrumentType;
  onSelectInstrument: (inst: InstrumentType) => void;
}

type NavTab = Exclude<LibraryView, 'Books'> | 'Books';

export const NavigationMapDrawer: React.FC<NavigationMapDrawerProps> = ({
  isOpen, onClose, allExercises, selectedExerciseId, onSelectExercise,
  currentInstrument, onSelectInstrument,
}) => {
  const [activeTab, setActiveTab] = useState<NavTab>('Genre Atlases');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenreParent, setSelectedGenreParent] = useState<string | null>(null);
  const [selectedGenreChild, setSelectedGenreChild] = useState<string | null>(null);
  const [selectedInstrumentCategory, setSelectedInstrumentCategory] = useState<string | null>(null);
  const [selectedInstrumentSubcategory, setSelectedInstrumentSubcategory] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [selectedMeter, setSelectedMeter] = useState('all');
  const [selectedVariationFilter, setSelectedVariationFilter] = useState<'all'|'base'|'variations'>('all');

  const instrumentExercises = useMemo(() => allExercises.filter(e => e.instrument === currentInstrument), [allExercises, currentInstrument]);

  const bookRows = useMemo(() => {
    const rows = new Map<string, { id:string; title:string; author:string; count:number; atlases:Set<string> }>();
    instrumentExercises.forEach(e => {
      const id = e.sourceBookId || e.bookReference || 'unattributed';
      const title = e.source?.title || e.bookReference || 'Original synthesis';
      const author = e.source?.author || 'No book citation';
      const row = rows.get(id) || { id, title, author, count:0, atlases:new Set<string>() };
      row.count += 1; row.atlases.add(e.atlas); rows.set(id,row);
    });
    return [...rows.values()].sort((a,b) => b.count-a.count || a.title.localeCompare(b.title));
  }, [instrumentExercises]);

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return instrumentExercises.filter(e => {
      if (activeTab === 'Genre Atlases') {
        if (selectedGenreParent && e.genreParent !== selectedGenreParent) return false;
        if (selectedGenreChild && e.genreSubcategory !== selectedGenreChild) return false;
      }
      if (activeTab === 'Guitar & Bass Exercises') {
        if (!e.librarySections?.includes('instrument-exercises')) return false;
        if (selectedInstrumentCategory && e.instrumentExerciseCategory !== selectedInstrumentCategory) return false;
        if (selectedInstrumentSubcategory && e.instrumentExerciseSubcategory !== selectedInstrumentSubcategory) return false;
      }
      if (activeTab === 'Books' && selectedBookId) {
        const id = e.sourceBookId || e.bookReference || 'unattributed';
        if (id !== selectedBookId) return false;
      }
      if (selectedMeter !== 'all') {
        if (selectedMeter === 'odd') { if (['4/4','3/4','2/4','6/8','12/8'].includes(e.timeSignature)) return false; }
        else if (e.timeSignature !== selectedMeter) return false;
      }
      if (selectedVariationFilter === 'base' && e.variationType && e.variationType !== 'base') return false;
      if (selectedVariationFilter === 'variations' && (!e.variationType || e.variationType === 'base')) return false;
      if (q) {
        const text = [e.title,e.atlas,e.bookReference,e.focus,e.description,e.musicalRole,e.instrumentExerciseCategory,e.instrumentExerciseSubcategory,...(e.tags||[]),...(e.styleTags||[]),...(e.techniqueTags||[]),...(e.conceptTags||[])].filter(Boolean).join(' ').toLowerCase();
        if (!text.includes(q)) return false;
      }
      return true;
    });
  }, [instrumentExercises, activeTab, searchQuery, selectedGenreParent, selectedGenreChild, selectedInstrumentCategory, selectedInstrumentSubcategory, selectedBookId, selectedMeter, selectedVariationFilter]);

  const reset = () => {
    setSelectedGenreParent(null); setSelectedGenreChild(null);
    setSelectedInstrumentCategory(null); setSelectedInstrumentSubcategory(null); setSelectedBookId(null);
    setSelectedMeter('all'); setSelectedVariationFilter('all'); setSearchQuery('');
  };

  const chooseTab = (tab: NavTab) => {
    setActiveTab(tab); setSelectedGenreParent(null); setSelectedGenreChild(null);
    setSelectedInstrumentCategory(null); setSelectedInstrumentSubcategory(null); setSelectedBookId(null);
  };
  const selectExercise = (e: ExerciseItem) => { onSelectExercise(e); onClose(); };
  if (!isOpen) return null;

  const instrumentMapCount = instrumentExercises.filter(e => e.librarySections?.includes('instrument-exercises')).length;

  return <div className="fixed inset-0 z-50 flex flex-col bg-stone-950/95 backdrop-blur-md text-stone-100 overflow-hidden animate-in fade-in duration-150" role="dialog" aria-modal="true" aria-label="Exercise Atlas">
    <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-stone-800 bg-stone-900/90">
      <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400"><BookOpen className="w-4 h-4" /></div><div><span className="text-sm sm:text-base font-bold tracking-tight text-white font-serif block">Exercise Atlas</span><span className="text-[10px] text-stone-400 font-mono hidden sm:block">Genres · guitar/bass workouts · theory · books</span></div></div>
        <div className="flex items-center rounded-lg bg-stone-800 p-0.5 border border-stone-700">{(['bass','guitar'] as InstrumentType[]).map(inst => <button key={inst} onClick={() => onSelectInstrument(inst)} className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all ${currentInstrument===inst?'bg-amber-500 text-stone-950 shadow-sm':'text-stone-400 hover:text-white'}`}>{inst==='bass'?'Bass':'Guitar'} ({allExercises.filter(e=>e.instrument===inst).length})</button>)}</div>
        <div className="flex items-center gap-1 border-l border-stone-800 pl-3 overflow-x-auto">{(['Genre Atlases','Guitar & Bass Exercises','Books'] as NavTab[]).map(tab => <button key={tab} onClick={()=>chooseTab(tab)} className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${activeTab===tab?'bg-stone-800 text-amber-300 font-semibold':'text-stone-400 hover:text-stone-200'}`}>{tab}{tab==='Guitar & Bass Exercises'?` (${instrumentMapCount})`:''}</button>)}</div>
      </div>
      <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs border border-stone-700">Close</button>
    </header>

    <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
      <aside className="w-full md:w-80 lg:w-96 shrink-0 border-b md:border-b-0 md:border-r border-stone-800 bg-stone-900/60 flex flex-col min-h-0 md:h-full max-h-[42vh] md:max-h-full">
        <div className="p-3 border-b border-stone-800 space-y-2">
          <div className="relative"><Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-stone-400"/><input value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder={`Search ${currentInstrument} exercises...`} className="w-full pl-9 pr-8 py-1.5 rounded-lg bg-stone-950/80 border border-stone-700 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"/>{searchQuery&&<button onClick={()=>setSearchQuery('')} className="absolute right-2.5 top-2 text-stone-400"><X className="w-3.5 h-3.5"/></button>}</div>
          <button onClick={reset} className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300"><RotateCcw className="w-3.5 h-3.5"/> All {activeTab}</button>
          <div className="grid grid-cols-2 gap-2"><select value={selectedMeter} onChange={e=>setSelectedMeter(e.target.value)} className="bg-stone-950 border border-stone-700 rounded-md px-2 py-1.5 text-[11px] text-stone-300"><option value="all">All meters</option><option value="4/4">4/4</option><option value="3/4">3/4</option><option value="2/4">2/4</option><option value="6/8">6/8</option><option value="12/8">12/8</option><option value="odd">Other meters</option></select><select value={selectedVariationFilter} onChange={e=>setSelectedVariationFilter(e.target.value as any)} className="bg-stone-950 border border-stone-700 rounded-md px-2 py-1.5 text-[11px] text-stone-300"><option value="all">All patterns</option><option value="base">Base patterns</option><option value="variations">Variations</option></select></div>
        </div>

        {activeTab==='Genre Atlases' && <nav className="flex-1 overflow-y-auto p-2 space-y-2" aria-label="Genre atlases">{GENRE_ATLAS_TREE.map(group=>{const open=selectedGenreParent===group.name;const groupCount=instrumentExercises.filter(e=>e.genreParent===group.name || e.atlas===group.name).length;return <div key={group.name} className="rounded-lg border border-stone-800 bg-stone-950/30 overflow-hidden"><button onClick={()=>{setSelectedGenreParent(open?null:group.name);setSelectedGenreChild(null);setSelectedBookId(null)}} className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs ${open?'text-amber-200 bg-amber-500/10':'text-stone-200 hover:bg-stone-800/50'}`}><span className="font-semibold">{group.name}</span><span className="flex items-center gap-2"><span className="font-mono text-[10px] text-stone-500">{groupCount}</span><ChevronDown className={`w-3.5 h-3.5 transition-transform ${open?'rotate-180':''}`}/></span></button>{open&&<div className="p-1 border-t border-stone-800">{group.children.map(child=>{const active=selectedGenreChild===child;const count=instrumentExercises.filter(e=>e.genreParent===group.name&&e.genreSubcategory===child).length;return <button key={child} onClick={()=>setSelectedGenreChild(active?null:child)} className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left text-[11px] ${active?'text-amber-200 bg-stone-800':'text-stone-400 hover:text-stone-200 hover:bg-stone-900'}`}><span>{child}</span><span className="font-mono text-[10px] text-stone-500">{count}</span></button>})}</div>}</div>})}</nav>}

        {activeTab==='Books' && <nav className="flex-1 overflow-y-auto p-2 space-y-1" aria-label="Books">{bookRows.map(book=><button key={book.id} onClick={()=>setSelectedBookId(selectedBookId===book.id?null:book.id)} className={`w-full text-left p-3 rounded-lg border transition-all ${selectedBookId===book.id?'bg-amber-500/10 border-amber-500/30':'bg-stone-950/30 border-stone-800 hover:bg-stone-800/50'}`}><div className="text-xs font-semibold text-stone-100">{book.title}</div><div className="text-[10px] text-stone-500 mt-0.5">{book.author}</div><div className="flex items-center justify-between mt-2 text-[10px] font-mono"><span className="text-amber-300">{book.count} exercises</span><span className="text-stone-500">{book.atlases.size} atlases</span></div></button>)}</nav>}
      </aside>

      <section className="flex-1 min-w-0 flex flex-col bg-stone-950/60">
        <div className="shrink-0 px-5 py-4 border-b border-stone-800 flex items-center justify-between gap-4"><div><div className="text-[10px] font-mono uppercase tracking-wider text-amber-400">{selectedBookId?'Book':selectedGenreChild||selectedGenreParent||selectedInstrumentCategory||activeTab}</div><h2 className="text-lg font-serif font-bold text-white">{selectedBookId?(bookRows.find(b=>b.id===selectedBookId)?.title||'Book exercises'):selectedGenreChild||selectedGenreParent||selectedInstrumentSubcategory||activeTab}</h2><div className="text-xs text-stone-500 mt-0.5">{filteredExercises.length} exercises</div></div><SlidersHorizontal className="w-4 h-4 text-stone-500"/></div>
        <div className="flex-1 overflow-y-auto p-3 sm:p-5">{filteredExercises.length===0?<div className="h-full flex items-center justify-center text-sm text-stone-500">No exercises match the current filters.</div>:<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2.5">{filteredExercises.map(e=>{const v=getVariationInfo(e.variationType);return <button key={e.id} onClick={()=>selectExercise(e)} className={`group text-left p-3 rounded-xl border transition-all ${selectedExerciseId===e.id?'bg-amber-500/10 border-amber-500/40':'bg-stone-900/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900'}`}><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="text-xs font-semibold text-stone-100 leading-snug">{e.title}</div><div className="text-[10px] text-stone-500 mt-1 truncate">{e.atlas} · {e.timeSignature} · {e.defaultBpm} BPM</div></div><Play className="w-3.5 h-3.5 shrink-0 text-stone-600 group-hover:text-amber-400"/></div><div className="flex flex-wrap gap-1 mt-2">{e.styleTags?.slice(0,3).map(t=><span key={t} className="px-1.5 py-0.5 rounded bg-stone-800 text-[9px] text-stone-400 font-mono">{t}</span>)}{e.variationType&&e.variationType!=='base'&&<span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-[9px] text-amber-300 font-mono">{v.shortLabel}</span>}</div><div className="mt-2 text-[10px] text-stone-500 truncate"><BookOpen className="inline w-3 h-3 mr-1"/>{e.bookReference || 'Original synthesis'}</div></button>})}</div>}</div>
      </section>
    </div>
  </div>;
};

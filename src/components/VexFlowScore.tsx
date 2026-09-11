import React, { useEffect, useRef, useState } from 'react';
import {
  Renderer,
  Stave,
  TabStave,
  StaveNote,
  TabNote,
  GhostNote,
  Voice,
  Formatter,
  Accidental,
  Beam,
  StaveConnector,
  BarlineType,
  Dot,
  StringNumber,
  FretHandFinger,
  Annotation,
  TabTie,
  StaveTie,
  ChordSymbol,
  Modifier,
  Fraction
} from 'vexflow';
import { NoteDefinition, InstrumentType, BassStringType, ExerciseEvent, VariationType } from '../types';
import { formatVexFlowKey, getInstrumentProfile } from '../utils/musicTheory';
import { durationToQuarterUnits, measureCapacityInQuarterUnits } from '../utils/rhythm';
import { getVariationInfo } from '../utils/variations';

interface RenderedEvent extends Omit<ExerciseEvent, 'notes'> {
  notes: NoteDefinition[];
}

interface VexFlowScoreProps {
  notes: NoteDefinition[];
  events?: RenderedEvent[];
  timeSignature: string;
  clef: 'bass' | 'treble';
  instrument: InstrumentType;
  bassStrings: BassStringType;
  profileId?: string;
  activeNoteIndex: number | null;
  exerciseTitle: string;
  bookReference?: string;
  onBookClick?: (bookId: string) => void;
  variationType?: VariationType | string;
  onNoteClick?: (index: number) => void;
  feelOverride?: string;
  chordProgression?: Array<{ beat: number; symbol: string }>;
}

function toRenderedFallback(notes: NoteDefinition[]): RenderedEvent[] {
  let beat = 0;
  return notes.map((n) => {
    const d = n.duration || '8';
    const e = { startBeat: beat, duration: d, notes: [n] };
    beat += durationToQuarterUnits(d);
    return e;
  });
}

function getBeamGroups(timeSignature: string): Fraction[] | undefined {
  const [num, den] = timeSignature.split('/').map(Number);
  if (den === 8) {
    if (num === 12) return [new Fraction(3, 8), new Fraction(3, 8), new Fraction(3, 8), new Fraction(3, 8)];
    if (num === 9) return [new Fraction(3, 8), new Fraction(3, 8), new Fraction(3, 8)];
    if (num === 6) return [new Fraction(3, 8), new Fraction(3, 8)];
    if (num === 7) return [new Fraction(2, 8), new Fraction(2, 8), new Fraction(3, 8)];
  } else if (den === 4) {
    return Array.from({ length: num }, () => new Fraction(1, 4));
  }
  return undefined;
}

interface SystemPlan {
  measureIndices: number[];
}

function planSystems(measures: RenderedEvent[][], availableWidth: number): SystemPlan[] {
  const count = measures.length;
  if (count <= 4) {
    return [{ measureIndices: Array.from({length: count}, (_, i) => i) }];
  }
  
  const systems: SystemPlan[] = [];
  let cur: number[] = [];
  let curWidth = 0;
  for (let i = 0; i < count; i++) {
    const isFirst = cur.length === 0;
    const needed = (isFirst ? 95 : 45) + Math.max(measures[i].length * 44, 200);
    if (cur.length > 0 && (curWidth + needed > availableWidth || cur.length >= 4)) {
      systems.push({ measureIndices: cur });
      cur = [i];
      curWidth = 95 + Math.max(measures[i].length * 44, 200);
    } else {
      cur.push(i);
      curWidth += needed;
    }
  }
  if (cur.length > 0) {
    systems.push({ measureIndices: cur });
  }
  return systems;
}

export const VexFlowScore: React.FC<VexFlowScoreProps> = ({
  notes,
  events,
  timeSignature,
  clef,
  instrument,
  bassStrings,
  profileId,
  activeNoteIndex,
  exerciseTitle,
  bookReference,
  onBookClick,
  variationType,
  feelOverride,
  chordProgression,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(850);
  const varInfo = getVariationInfo(variationType);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let raf = 0;
    let last = 0;
    const updateWidth = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = Math.floor(el.getBoundingClientRect().width || el.clientWidth);
        if (w > 100 && Math.abs(w - last) >= 2) {
          last = w;
          setContainerWidth(w);
        }
      });
    };
    updateWidth();
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    setRenderError(null);
    containerRef.current.innerHTML = '';

    try {
      const source = (events?.length ? events : toRenderedFallback(notes)) as RenderedEvent[];
      const cap = measureCapacityInQuarterUnits(timeSignature);
      const sorted = [...source].sort((a, b) => a.startBeat - b.startBeat);
      const renderEvents: RenderedEvent[] = [];
      let cursor = 0;

      for (const e of sorted) {
        if (e.startBeat > cursor + 0.001) {
          let gap = e.startBeat - cursor;
          while (gap > 0.001) {
            const d = gap >= 1 ? 'q' : gap >= 0.5 ? '8' : gap >= 0.25 ? '16' : '32';
            const u = durationToQuarterUnits(d);
            renderEvents.push({
              startBeat: cursor,
              duration: d,
              notes: [
                {
                  semitoneFromRoot: 0,
                  octaveOffset: 0,
                  duration: d,
                  stringNumber: 1,
                  fret: 0,
                  intervalDegree: 'R',
                  isRest: true,
                } as unknown as NoteDefinition,
              ],
            });
            cursor += u;
            gap -= u;
          }
        }
        renderEvents.push(e);
        cursor = Math.max(cursor, e.startBeat + durationToQuarterUnits(e.duration));
      }

      const measures: RenderedEvent[][] = [];
      for (const e of renderEvents) {
        const idx = Math.floor(e.startBeat / cap);
        while (measures.length <= idx) measures.push([]);
        measures[idx].push(e);
      }
      if (!measures.length) return;

      const profile = getInstrumentProfile(profileId, instrument);
      const numLines = profile.strings.length;
      const [beats, beatValue] = timeSignature.split('/').map(Number);

      
      const minRequiredWidth = measures.reduce((acc, m, i) => acc + (i === 0 ? 95 : 45) + Math.max(m.length * 44, 200), 28);
      
      const targetWidth = Math.max(620, containerWidth - 16, minRequiredWidth);

      const systemsPlan = planSystems(measures, targetWidth);

      const systemHeight = numLines === 4 ? 180 : 190;
      const marginTop = chordProgression?.length ? 30 : 16;
      const totalSvgHeight = systemsPlan.length * systemHeight + marginTop + 10;

      const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
      renderer.resize(targetWidth, totalSvgHeight);
      const context = renderer.getContext();
      context.setFont('Arial', 10);

      const allTabTies: TabTie[] = [];
      const allStaveTies: StaveTie[] = [];
      let previousTabNote: TabNote | null = null;
      let previousStaveNote: StaveNote | null = null;
      let previousSlurToNext = false;

      systemsPlan.forEach((plan, sysIdx) => {
        const sysMeasureIndices = plan.measureIndices;
        const staveY = marginTop + sysIdx * systemHeight;
        const tabY = staveY + 98;

        const startX = 14;
        const totalLineWidth = targetWidth - 28;
        const isSingleMeasurePiece = measures.length === 1;

        const measureWidths = sysMeasureIndices.map(() => {
          if (isSingleMeasurePiece) {
            return totalLineWidth;
          }
          return Math.floor(totalLineWidth / sysMeasureIndices.length);
        });

        let currentX = startX;

        sysMeasureIndices.forEach((mIdx, colIdx) => {
          const measureEvents = measures[mIdx];
          const mWidth = measureWidths[colIdx];
          const x = currentX;
          currentX += mWidth;

          const isFirstInSystem = colIdx === 0;
          const isFirstInPiece = mIdx === 0;
          const isLastInPiece = mIdx === measures.length - 1;
          const isLastInSystem = colIdx === sysMeasureIndices.length - 1;

          const stave = new Stave(x, staveY, mWidth);
          if (isFirstInSystem) {
            stave.addClef(clef);
            if (isFirstInPiece) {
              stave.addTimeSignature(timeSignature);
            }
          }
          if (isLastInPiece) {
            stave.setEndBarType(BarlineType.END);
          } else {
            stave.setEndBarType(BarlineType.SINGLE);
          }
          stave.setContext(context).draw();

          const tab = new TabStave(x, tabY, mWidth);
          tab.setNumLines(numLines);
          if (isFirstInSystem) {
            tab.addClef('tab');
          }
          if (isLastInPiece) {
            tab.setEndBarType(BarlineType.END);
          } else {
            tab.setEndBarType(BarlineType.SINGLE);
          }
          tab.setContext(context).draw();

          const sx = Math.max(stave.getNoteStartX(), tab.getNoteStartX());
          stave.setNoteStartX(sx);
          tab.setNoteStartX(sx);

          if (isFirstInSystem) {
            const cLeft = new StaveConnector(stave, tab);
            cLeft.setType(StaveConnector.type.SINGLE_LEFT);
            cLeft.setContext(context).draw();
          }

          if (isLastInSystem) {
            const cRight = new StaveConnector(stave, tab);
            cRight.setType(isLastInPiece ? StaveConnector.type.BOLD_DOUBLE_RIGHT : StaveConnector.type.SINGLE_RIGHT);
            cRight.setContext(context).draw();
          }

          const staveNotes: StaveNote[] = [];
          const tabNotes: (TabNote | GhostNote)[] = [];

          for (const e of measureEvents) {
            const playable = e.notes.filter((n) => !n.isRest);
            const isRest = !playable.length || Boolean(e.notes[0]?.isRest);
            const isDotted = e.duration.includes('.');
            const cleanDuration = e.duration.replace('.', '') + (isDotted ? 'd' : '');
            const durationStr = isRest ? `${cleanDuration}r` : cleanDuration;
            const restKey = clef === 'bass' ? 'd/3' : 'b/4';
            const getWrittenOctave = (oct: number) => {
              if (clef === 'bass' || instrument === 'bass' || instrument === 'guitar') {
                return oct + 1;
              }
              return oct;
            };

            const keys = !isRest
              ? playable.map((n) => formatVexFlowKey(n.pitch, getWrittenOctave(n.octave)).key)
              : [restKey];

            const sn = new StaveNote({ keys, duration: durationStr, clef });
            if (!isRest) {
              playable.forEach((n, i) => {
                const k = formatVexFlowKey(n.pitch, getWrittenOctave(n.octave));
                if (k.accidental) sn.addModifier(new Accidental(k.accidental), i);
                if (n.leftHandFinger) {
                  sn.addModifier(new FretHandFinger(String(n.leftHandFinger)).setPosition(Modifier.Position.LEFT), i);
                }
              });
            }
            if (isDotted) {
              keys.forEach((_, i) => sn.addModifier(new Dot(), i));
            }
            sn.setStyle({ fillStyle: '#111827', strokeStyle: '#111827' });

            const eventIdx = e.notes[0]?.eventIndex;
            if (eventIdx !== undefined) {
              sn.setAttribute('id', 'sn-' + eventIdx);
              sn.addClass('vf-note-ev-' + eventIdx);
            }

            if (chordProgression) {
              const chord = chordProgression.find((c) => Math.abs(c.beat - e.startBeat) < 0.001);
              if (chord) {
                sn.addModifier(new ChordSymbol().addText(chord.symbol).setHorizontal('left').setVertical('top'), 0);
              }
            }

            staveNotes.push(sn);

            if (isRest) {
              const gn = new GhostNote({ duration: durationStr });
              tabNotes.push(gn);
              previousTabNote = null;
              previousStaveNote = null;
              previousSlurToNext = false;
            } else {
              const positions = playable.map((n) => ({
                str: Math.max(1, Math.min(numLines, n.stringNumber || 1)),
                fret: String(Math.max(0, n.fret ?? 0)),
              }));
              const tn = new TabNote({ positions, duration: durationStr });
              if (isDotted) {
                positions.forEach((_, i) => tn.addModifier(new Dot(), i));
              }

              const firstNote = playable[0];
              if (firstNote && firstNote.rightHandFinger) {
                tn.addModifier(
                  new Annotation(firstNote.rightHandFinger).setVerticalJustification(
                    Annotation.VerticalJustify.BOTTOM
                  ),
                  0
                );
              }
              if (firstNote && firstNote.technique === 'slap') {
                tn.addModifier(new Annotation('s').setVerticalJustification(Annotation.VerticalJustify.BOTTOM), 0);
              } else if (firstNote && firstNote.technique === 'pop') {
                tn.addModifier(new Annotation('p').setVerticalJustification(Annotation.VerticalJustify.BOTTOM), 0);
              }

              tn.setStyle({ fillStyle: '#111827', strokeStyle: '#111827' });
              if (eventIdx !== undefined) {
                tn.setAttribute('id', 'tn-' + eventIdx);
                tn.addClass('vf-tab-ev-' + eventIdx);
              }
              tabNotes.push(tn);

              if (previousTabNote && previousSlurToNext) {
                const firstIndexes = playable.map((_, i) => i);
                const lastIndexes = playable.map((_, i) => i);
                allTabTies.push(
                  new TabTie({
                    firstNote: previousTabNote,
                    lastNote: tn,
                    firstIndexes,
                    lastIndexes,
                  })
                );
              }
              if (previousStaveNote && previousSlurToNext) {
                const firstIndexes = playable.map((_, i) => i);
                const lastIndexes = playable.map((_, i) => i);
                allStaveTies.push(
                  new StaveTie({
                    firstNote: previousStaveNote,
                    lastNote: sn,
                    firstIndexes,
                    lastIndexes,
                  })
                );
              }

              previousTabNote = tn;
              previousStaveNote = sn;
              previousSlurToNext = Boolean(playable[0]?.slurToNext);
            }
          }

          if (staveNotes.length) {
            const voice = new Voice({ numBeats: beats || 4, beatValue: beatValue || 4 }).setStrict(false);
            voice.addTickables(staveNotes);
            const tv = new Voice({ numBeats: beats || 4, beatValue: beatValue || 4 }).setStrict(false);
            tv.addTickables(tabNotes);

            const endBoundary = Math.min(stave.getNoteEndX(), tab.getNoteEndX());
            const printableWidth = Math.max(40, endBoundary - sx - 14);

            const formatter = new Formatter();
            formatter.joinVoices([voice]);
            formatter.joinVoices([tv]);
            formatter.format([voice, tv], printableWidth);

            voice.draw(context, stave);
            tv.draw(context, tab);

            try {
              const beamGroups = getBeamGroups(timeSignature);
              const beams = beamGroups
                ? Beam.generateBeams(staveNotes, { groups: beamGroups })
                : Beam.generateBeams(staveNotes);
              beams.forEach((b) => b.setContext(context).draw());
            } catch {
              try {
                Beam.generateBeams(staveNotes).forEach((b) => b.setContext(context).draw());
              } catch {}
            }
          }
        });
      });

      allTabTies.forEach((t) => t.setContext(context).draw());
      allStaveTies.forEach((t) => t.setContext(context).draw());
    } catch (err) {
      console.error(err);
      setRenderError((err as Error).message || 'Failed to render music score.');
    }
  }, [notes, events, timeSignature, clef, instrument, profileId, containerWidth, chordProgression]);

  useEffect(() => {
    if (!containerRef.current) return;
    const oldActive = containerRef.current.querySelectorAll('.vf-active-note');
    oldActive.forEach((el) => el.classList.remove('vf-active-note'));

    if (activeNoteIndex !== null) {
      const staveSelectors = [
        `#vf-sn-${activeNoteIndex}`,
        `#vf-vf-sn-${activeNoteIndex}`,
        `[id$="sn-${activeNoteIndex}"]`,
        `.vf-note-ev-${activeNoteIndex}`,
      ].join(', ');
      const gSns = containerRef.current.querySelectorAll(staveSelectors);
      gSns.forEach((el) => el.classList.add('vf-active-note'));

      const tabSelectors = [
        `#vf-tn-${activeNoteIndex}`,
        `#vf-vf-tn-${activeNoteIndex}`,
        `[id$="tn-${activeNoteIndex}"]`,
        `.vf-tab-ev-${activeNoteIndex}`,
      ].join(', ');
      const gTns = containerRef.current.querySelectorAll(tabSelectors);
      gTns.forEach((el) => el.classList.add('vf-active-note'));
    }
  }, [activeNoteIndex]);

  const active =
    activeNoteIndex !== null
      ? (events || []).find((e) => e.notes.some((n) => n.eventIndex === activeNoteIndex))?.notes[0]
      : notes[activeNoteIndex ?? -1];
  const activeFeel = feelOverride && feelOverride !== 'exercise' ? feelOverride : active?.microtiming;

  return (
    <div className="w-full h-full flex flex-col bg-white select-none overflow-hidden relative">
      <style>{`
        .vf-active-note path, .vf-active-note rect, .vf-active-note text {
          fill: #d97706 !important;
          stroke: #d97706 !important;
          font-weight: bold !important;
        }
      `}</style>
      <div className="flex items-center justify-between px-4 py-1.5 bg-white border-b border-stone-200/80 text-xs">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="font-semibold text-stone-900 text-xs tracking-wide font-serif">{exerciseTitle}</span>
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border ${varInfo.badgeClass}`}
            title={varInfo.description}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${varInfo.dotClass}`} />
            {varInfo.label}
          </span>
          {bookReference && (
            <button
              onClick={() => onBookClick && onBookClick(bookReference)}
              className={`text-[11px] font-mono truncate max-w-[280px] lg:max-w-[420px] ${onBookClick ? 'text-amber-600 hover:text-amber-700 hover:underline cursor-pointer' : 'text-stone-500 cursor-default'}`}
              title={bookReference}
            >
              • {bookReference}
            </button>
          )}
        </div>
        <div className="text-[11px] text-stone-500 font-mono shrink-0 ml-2">
          {clef === 'bass' ? 'Bass Clef' : 'Treble Clef'} • {timeSignature}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-auto hide-scrollbar px-2 py-1 flex justify-center items-start bg-white">
        {renderError ? (
          <div className="p-3 text-stone-700 bg-stone-100 rounded border border-stone-300 text-xs font-mono">
            Notation notice: {renderError}
          </div>
        ) : (
          <div
            ref={containerRef}
            id="vexflow-score-svg"
            className="min-w-full flex justify-center px-4"
          />
        )}
      </div>
      {active && (
        <div className="absolute bottom-2 right-4 px-2.5 py-1 rounded bg-stone-900 text-stone-100 text-[11px] font-mono flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>
            {active.pitch}
            {active.octave} • {active.intervalDegree}
          </span>
          {activeFeel && (
            <span className="px-1.5 py-0.5 rounded-sm bg-stone-700 text-stone-300 text-[9px] uppercase tracking-wider">
              {activeFeel}
            </span>
          )}
        </div>
      )}
    </div>
  );
};


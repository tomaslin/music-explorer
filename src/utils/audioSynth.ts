import { midiToFrequency } from './musicTheory';
import { durationToQuarterUnits, isRestDuration } from './rhythm';
import { AccentType, Microtiming } from '../types';
import { WorkletSynthesizer } from 'spessasynth_lib';

export interface PlaybackNote {
  midi: number;
  duration: string;
  velocity?: number;
  accent?: AccentType;
  microtiming?: Microtiming;
  /** Exact deterministic offset in quarter-note beats. */
  microtimingOffsetBeats?: number;
  isRest?: boolean;
}
export interface PlaybackEvent {
  startBeat: number;
  duration: string;
  notes: PlaybackNote[];
}

type ScheduledVoice = { oscillators: OscillatorNode[]; gain: GainNode };

class SoundEngine {
  private ctx: AudioContext | null = null;
  private synth: WorkletSynthesizer | null = null;
  private isSynthReady = false;
  private synthInitAttempted = false;
  private isMetronomePlaying = false;
  private isExercisePlaying = false;
  private tempo = 80;
  private timeSignatureBeats = 4;
  private timeSignatureDenominator = 4;
  private metronomeGroupSize = 1;
  private currentBeat = 0;
  private customMetronomePattern: Array<{ beat: number; isAccent: boolean }> | null = null;
  private metronomeScheduler: number | null = null;
  private exerciseScheduler: number | null = null;
  private completionTimer: number | null = null;
  private exerciseGeneration = 0;
  private scheduledCallbacks = new Set<number>();
  private metronomeCallbacks = new Set<number>();
  private scheduledVoices = new Set<ScheduledVoice>();
  private onBeatCallbacks: Set<(beat: number) => void> = new Set();
  private onExerciseStopCallbacks: Set<() => void> = new Set();

  private async ensureContext(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      try { await this.ctx.resume(); } catch {}
    }
    return this.ctx;
  }

  public initSynthBackground(): void {
    if (this.synthInitAttempted) return;
    this.synthInitAttempted = true;
    this.doInitSynth().catch(() => {});
  }

  private async doInitSynth(): Promise<void> {
    const ctx = await this.ensureContext();
    try {
      await ctx.audioWorklet.addModule('/spessasynth_processor.min.js');
      const synthInstance = new WorkletSynthesizer(ctx);
      synthInstance.connect(ctx.destination);
      await synthInstance.isReady;
      const sfResponse = await fetch('/trimmed.sf2');
      if (!sfResponse.ok) return;
      await synthInstance.soundBankManager.addSoundBank(await sfResponse.arrayBuffer(), 'main');
      try {
        synthInstance.programChange(0, 27);
        synthInstance.programChange(1, 33);
        synthInstance.programChange(9, 0);
      } catch {}
      this.synth = synthInstance;
      this.isSynthReady = true;
    } catch {
      // Procedural Web Audio remains the timing-accurate fallback.
    }
  }

  private getContextSync(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  }

  private clearTimer(ref: number | null) {
    if (ref !== null) window.clearTimeout(ref);
  }

  private clearScheduledCallbacks() {
    this.scheduledCallbacks.forEach(id => window.clearTimeout(id));
    this.scheduledCallbacks.clear();
  }

  private clearScheduledVoices() {
    const ctx = this.ctx;
    if (!ctx) return;
    for (const voice of this.scheduledVoices) {
      try { voice.gain.gain.cancelScheduledValues(ctx.currentTime); voice.gain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.008); } catch {}
      for (const osc of voice.oscillators) {
        try { osc.stop(ctx.currentTime + 0.025); } catch {}
      }
    }
    this.scheduledVoices.clear();
  }

  public playClick(isAccent = false) {
    if (this.isSynthReady && this.synth) {
      try {
        const note = isAccent ? 76 : 77;
        this.synth.noteOn(9, note, isAccent ? 112 : 96);
        window.setTimeout(() => { try { this.synth?.noteOff(9, note); } catch {} }, 55);
        return;
      } catch {}
    }
    const ctx = this.getContextSync();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isAccent ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(isAccent ? 1200 : 800, now);
    osc.frequency.exponentialRampToValueAtTime(isAccent ? 400 : 200, now + 0.04);
    gain.gain.setValueAtTime(isAccent ? 0.9 : 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.055);
  }

  public playStringNote(midi: number, isBass = true, durationSec = 0.45, velocity = 100, accent: AccentType = 'normal') {
    if (this.isSynthReady && this.synth) {
      try {
        const channel = isBass ? 1 : 0;
        const v = Math.max(1, Math.min(127, velocity + (accent === 'accent' ? 12 : accent === 'marcato' ? 18 : accent === 'ghost' ? -35 : 0)));
        this.synth.noteOn(channel, midi, v);
        window.setTimeout(() => { try { this.synth?.noteOff(channel, midi); } catch {} }, Math.max(50, durationSec * 1000));
        return;
      } catch {}
    }
    this.scheduleProceduralNote(this.getContextSync().currentTime, midi, durationSec, isBass, velocity, accent);
  }

  private scheduleProceduralNote(at: number, midi: number, durationSec: number, isBass: boolean, velocity: number, accent: AccentType) {
    const ctx = this.getContextSync();
    const safeAt = Math.max(at, ctx.currentTime + 0.001);
    const freq = midiToFrequency(midi);
    const normalizedVelocity = Math.max(1, Math.min(127, velocity)) / 127;
    const velocityGain = Math.pow(normalizedVelocity, 1.5);
    const isGhost = normalizedVelocity < 50 / 127 || accent === 'ghost';
    const accentGain = accent === 'marcato' ? 1.12 : accent === 'accent' ? 1.06 : isGhost ? 0.42 : 1;
    const sustain = accent === 'marcato' ? 1.08 : accent === 'ghost' ? 0.55 : 1;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc1.type = isBass ? 'triangle' : 'sawtooth';
    osc2.type = isBass ? 'sine' : 'triangle';
    osc1.frequency.setValueAtTime(freq, safeAt);
    osc2.frequency.setValueAtTime(freq * (isBass ? 2 : 1.002), safeAt);
    filter.type = 'lowpass';
    const brightness = isGhost ? 0.58 : accent === 'marcato' ? 1.15 : 1;
    const cutoff = (isBass ? Math.min(1800, freq * 6) : Math.min(4000, freq * 8)) * brightness;
    filter.frequency.setValueAtTime(Math.max(120, cutoff), safeAt);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 1.5), safeAt + durationSec);
    const peak = (isBass ? 0.85 : 0.65) * velocityGain * accentGain;
    const end = safeAt + Math.max(0.08, durationSec * sustain);
    gain.gain.setValueAtTime(0.0001, safeAt);
    gain.gain.linearRampToValueAtTime(Math.max(0.001, peak), safeAt + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    const voice: ScheduledVoice = { oscillators: [osc1, osc2], gain };
    this.scheduledVoices.add(voice);
    const cleanup = () => this.scheduledVoices.delete(voice);
    osc1.addEventListener('ended', cleanup, { once: true });
    osc1.start(safeAt); osc2.start(safeAt);
    osc1.stop(end + 0.03); osc2.stop(end + 0.03);
  }

  private microtimingOffsetBeats(feel: Microtiming | undefined, startBeat: number): number {
    if (!feel || feel === 'straight') return 0;
    if (feel === 'laid-back') return 0.06;
    if (feel === 'ahead') return -0.06;
    const eighthPosition = Math.round(startBeat * 2);
    if (Math.abs(startBeat * 2 - eighthPosition) > 0.001 || eighthPosition % 2 === 0) return 0;
    if (feel === 'shuffle') return 0.14;
    return feel === 'swing-heavy' ? 0.16 : 0.09;
  }

  private metronomeBeatUnits() { return 4 / this.timeSignatureDenominator; }

  public async startMetronome(bpm: number, beats = 4, denominator = 4, customPattern?: Array<{ beat: number; isAccent: boolean }>) {
    await this.ensureContext();
    this.stopMetronome();
    this.tempo = bpm;
    this.timeSignatureBeats = beats;
    this.timeSignatureDenominator = denominator;
    this.metronomeGroupSize = denominator === 8 && beats % 3 === 0 ? 3 : 1;
    this.customMetronomePattern = customPattern || null;
    this.isMetronomePlaying = true;
    this.currentBeat = 0;
    this.scheduleMetronomeAhead();
  }

  public stopMetronome() {
    this.isMetronomePlaying = false;
    this.clearTimer(this.metronomeScheduler);
    this.metronomeScheduler = null;
    this.metronomeCallbacks.forEach(id => window.clearTimeout(id));
    this.metronomeCallbacks.clear();
  }

  public updateTempo(bpm: number) { this.tempo = bpm; }
  public updateTimeSignature(beats: number) { this.timeSignatureBeats = beats; }

  private scheduleMetronomeAhead = () => {
    if (!this.isMetronomePlaying) return;
    const ctx = this.getContextSync();
    const now = ctx.currentTime;
    const beatSec = (60 / this.tempo) * this.metronomeBeatUnits();
    const horizon = now + 0.12;
    let beat = this.currentBeat;
    let at = now + 0.01;
    while (at < horizon) {
      const patternEvent = this.customMetronomePattern?.find(p => Math.abs(p.beat - beat) < 0.001);
      const shouldPlay = patternEvent ? true : !this.customMetronomePattern;
      const isAccent = patternEvent ? patternEvent.isAccent : beat === 0 || (this.metronomeGroupSize > 1 && beat % this.metronomeGroupSize === 0);
      if (shouldPlay) {
        const delay = Math.max(0, (at - ctx.currentTime) * 1000);
        const timer = window.setTimeout(() => { if (this.isMetronomePlaying) this.playClick(isAccent); this.metronomeCallbacks.delete(timer); }, delay);
        this.metronomeCallbacks.add(timer);
      }
      this.onBeatCallbacks.forEach(cb => cb(beat));
      beat = (beat + 1) % this.timeSignatureBeats;
      at += beatSec;
    }
    this.currentBeat = beat;
    this.metronomeScheduler = window.setTimeout(this.scheduleMetronomeAhead, 45);
  };

  public async playExercise(
    events: PlaybackEvent[], bpm: number, isBass: boolean, onEvent: (index: number) => void,
    onComplete?: () => void, feelOverride?: Microtiming | 'exercise', loop = false, cycleBeats = 4
  ) {
    const ctx = await this.ensureContext();
    this.stopExercise(false);
    if (!events.length) return;
    this.isExercisePlaying = true;
    this.tempo = bpm;
    const generation = ++this.exerciseGeneration;
    const ordered = [...events].sort((a,b) => a.startBeat-b.startBeat);
    const actualSpan = Math.max(0, ...ordered.map(e => e.startBeat + durationToQuarterUnits(e.duration)));
    const cycle = Math.max(cycleBeats || 0, actualSpan);
    const beatSeconds = 60 / bpm;
    const lookAheadSeconds = 0.16;
    const baseStart = ctx.currentTime + 0.04;
    let scheduledThrough = 0;
    let nextCycle = 0;

    const scheduleWindow = () => {
      if (!this.isExercisePlaying || generation !== this.exerciseGeneration) return;
      const now = ctx.currentTime;
      const horizon = now + lookAheadSeconds;
      while (nextCycle * cycle * beatSeconds + baseStart < horizon) {
        const cycleStart = baseStart + nextCycle * cycle * beatSeconds;
        for (const [index,e] of ordered.entries()) {
          const feel = feelOverride && feelOverride !== 'exercise' ? feelOverride : e.notes.find(n => n.microtiming)?.microtiming;
          for (const note of e.notes) {
            if (note.isRest || isRestDuration(note.duration)) continue;
            const offset = (note.microtimingOffsetBeats ?? this.microtimingOffsetBeats(feel, e.startBeat));
            const noteAt = cycleStart + Math.max(0, e.startBeat + offset) * beatSeconds;
            const durationSec = Math.max(0.06, durationToQuarterUnits(note.duration) * beatSeconds * 0.92);
            this.scheduleProceduralNote(noteAt, note.midi, durationSec, isBass, note.velocity ?? 100, note.accent ?? 'normal');
            const delayMs = Math.max(0, (noteAt - ctx.currentTime) * 1000);
            const activeTimer = window.setTimeout(() => { if (this.isExercisePlaying && generation === this.exerciseGeneration) onEvent(index); this.scheduledCallbacks.delete(activeTimer); }, delayMs);
            this.scheduledCallbacks.add(activeTimer);
          }
        }
        nextCycle++;
      }
      scheduledThrough = Math.max(scheduledThrough, nextCycle * cycle * beatSeconds);
      if (loop) {
        this.exerciseScheduler = window.setTimeout(scheduleWindow, 35);
      } else if (nextCycle > 0) {
        const endAt = baseStart + actualSpan * beatSeconds;
        if (endAt > now) {
          this.completionTimer = window.setTimeout(() => {
            if (this.isExercisePlaying && generation === this.exerciseGeneration) this.finishExercise(onComplete);
          }, Math.max(20, (endAt - ctx.currentTime) * 1000));
        }
      }
    };
    void scheduledThrough;
    scheduleWindow();
  }

  private finishExercise(onComplete?: () => void) {
    this.isExercisePlaying = false;
    this.clearTimer(this.exerciseScheduler); this.exerciseScheduler = null;
    this.clearTimer(this.completionTimer); this.completionTimer = null;
    onComplete?.();
    this.onExerciseStopCallbacks.forEach(cb => cb());
  }

  public stopExercise(notify = true) {
    this.exerciseGeneration++;
    this.isExercisePlaying = false;
    this.clearTimer(this.exerciseScheduler); this.exerciseScheduler = null;
    this.clearTimer(this.completionTimer); this.completionTimer = null;
    this.clearScheduledCallbacks();
    this.clearScheduledVoices();
    if (this.isSynthReady && this.synth) { try { this.synth.stopAll(); } catch {} }
    if (notify) this.onExerciseStopCallbacks.forEach(cb => cb());
  }

  public isExerciseActive() { return this.isExercisePlaying; }
  public isMetronomeActive() { return this.isMetronomePlaying; }
  public subscribeBeat(cb: (beat: number) => void) { this.onBeatCallbacks.add(cb); return () => this.onBeatCallbacks.delete(cb); }
  public subscribeExerciseStop(cb: () => void) { this.onExerciseStopCallbacks.add(cb); return () => this.onExerciseStopCallbacks.delete(cb); }
}

export const soundEngine = new SoundEngine();

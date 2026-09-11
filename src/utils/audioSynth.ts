import { midiToFrequency } from './musicTheory';
import { durationToQuarterUnits, isRestDuration } from './rhythm';
import { AccentType, Microtiming } from '../types';
import { WorkletSynthesizer } from 'spessasynth_lib';

export interface PlaybackNote {
  midi: number; duration: string; velocity?: number; accent?: AccentType; microtiming?: Microtiming; isRest?: boolean;
}
export interface PlaybackEvent {
  startBeat: number; duration: string; notes: PlaybackNote[];
}

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
  private metronomeTimeStart = 0;
  private customMetronomePattern: Array<{beat: number, isAccent: boolean}> | null = null;
  private timerId: number | null = null;
  private exerciseTimerId: number | null = null;
  private onBeatCallbacks: Set<(beat: number) => void> = new Set();
  private onExerciseStopCallbacks: Set<() => void> = new Set();

  private async ensureContext(): Promise<AudioContext> {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch (err) {
        console.warn('AudioContext resume failed:', err);
      }
    }
    return this.ctx;
  }

  public initSynthBackground(): void {
    if (this.synthInitAttempted) return;
    this.synthInitAttempted = true;
    this.doInitSynth().catch(err => {
      console.info('SoundFont enhancement unavailable; continuing with built-in Web Audio synth.', err);
    });
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
      const sfBuffer = await sfResponse.arrayBuffer();
      await synthInstance.soundBankManager.addSoundBank(sfBuffer, 'main');

      // Clean guitar (ch 0), Finger bass (ch 1), Percussion (ch 9)
      try {
        synthInstance.programChange(0, 27);
        synthInstance.programChange(1, 33);
        synthInstance.programChange(9, 0);
      } catch {}

      this.synth = synthInstance;
      this.isSynthReady = true;
    } catch (err) {
      console.info('WorkletSynthesizer fallback to procedural Web Audio synth:', err);
    }
  }

  private getContextSync(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playClick(isAccent = false) {
    const ctx = this.getContextSync();
    const now = ctx.currentTime;
    
    if (this.isSynthReady && this.synth) {
      try {
        const note = isAccent ? 76 : 77;
        this.synth.noteOn(9, note, 100);
        window.setTimeout(() => {
          try { this.synth?.noteOff(9, note); } catch {}
        }, 80);
        return;
      } catch {}
    }

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

  public playStringNote(
    midi: number,
    isBass = true,
    durationSec = 0.45,
    velocity = 100,
    accent: AccentType = 'normal'
  ) {
    const ctx = this.getContextSync();
    const now = ctx.currentTime;
    
    if (this.isSynthReady && this.synth) {
      try {
        const channel = isBass ? 1 : 0;
        const normalizedVelocity = Math.max(1, Math.min(127, velocity));
        let accentVel = normalizedVelocity;
        let sustain = 1.0;
        if (accent === 'marcato') { accentVel = Math.min(127, normalizedVelocity + 20); sustain = 1.08; }
        else if (accent === 'accent') { accentVel = Math.min(127, normalizedVelocity + 15); sustain = 1.0; }
        else if (accent === 'ghost') { accentVel = Math.max(1, normalizedVelocity - 40); sustain = 0.55; }
        
        this.synth.noteOn(channel, midi, accentVel);
        window.setTimeout(() => {
          try { this.synth?.noteOff(channel, midi); } catch {}
        }, Math.max(50, durationSec * sustain * 1000));
        return;
      } catch {}
    }

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
    osc1.frequency.setValueAtTime(freq, now);
    osc2.frequency.setValueAtTime(freq * (isBass ? 2 : 1.002), now);
    filter.type = 'lowpass';
    const brightness = isGhost ? 0.58 : accent === 'marcato' ? 1.15 : 1;
    const cutoff = (isBass ? Math.min(1800, freq * 6) : Math.min(4000, freq * 8)) * brightness;
    filter.frequency.setValueAtTime(Math.max(120, cutoff), now);
    filter.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 1.5), now + durationSec);
    const peak = (isBass ? 0.85 : 0.65) * velocityGain * accentGain;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(Math.max(0.001, peak), now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.08, durationSec * sustain));
    osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    osc1.start(now); osc2.start(now);
    osc1.stop(now + durationSec + 0.05); osc2.stop(now + durationSec + 0.05);
  }

  public async startMetronome(bpm: number, beats = 4, denominator = 4, customPattern?: Array<{beat: number, isAccent: boolean}>) {
    await this.ensureContext();
    this.initSynthBackground();
    this.stopMetronome();
    this.tempo = bpm;
    this.timeSignatureBeats = beats;
    this.timeSignatureDenominator = denominator;
    this.metronomeGroupSize = denominator === 8 && beats % 3 === 0 ? 3 : 1;
    this.customMetronomePattern = customPattern || null;
    this.isMetronomePlaying = true;
    this.currentBeat = 0;
    this.metronomeTimeStart = performance.now();
    this.runMetronomeTick();
  }

  public stopMetronome() {
    this.isMetronomePlaying = false;
    if (this.timerId !== null) { window.clearTimeout(this.timerId); this.timerId = null; }
  }

  public updateTempo(bpm: number) { this.tempo = bpm; }
  public updateTimeSignature(beats: number) { this.timeSignatureBeats = beats; }

  private runMetronomeTick = () => {
    if (!this.isMetronomePlaying) return;
    
    let isAccent = false;
    let shouldPlay = true;
    
    if (this.customMetronomePattern) {
        const patternEvent = this.customMetronomePattern.find(p => Math.abs(p.beat - this.currentBeat) < 0.05);
        if (patternEvent) {
            shouldPlay = true;
            isAccent = patternEvent.isAccent;
        } else {
            shouldPlay = false;
        }
    } else {
        isAccent = this.currentBeat === 0 || (this.metronomeGroupSize > 1 && this.currentBeat % this.metronomeGroupSize === 0);
    }
    
    if (shouldPlay) {
      this.playClick(isAccent);
    }
    
    this.onBeatCallbacks.forEach(cb => cb(this.currentBeat));
    this.currentBeat = (this.currentBeat + 1) % this.timeSignatureBeats;
    const subdivisionMs = (60 / this.tempo) * 1000 * (4 / this.timeSignatureDenominator);
    this.timerId = window.setTimeout(this.runMetronomeTick, subdivisionMs);
  };

  private microtimingOffsetMs(feel: Microtiming | undefined, bpm: number, startBeat: number): number {
    if (!feel || feel === 'straight') return 0;
    const beatMs = (60 / bpm) * 1000;
    if (feel === 'laid-back') return beatMs * 0.06;
    if (feel === 'ahead') return -beatMs * 0.06;
    const eighthPosition = Math.round(startBeat * 2);
    if (Math.abs(startBeat * 2 - eighthPosition) > 0.001 || eighthPosition % 2 === 0) return 0;
    if (feel === 'shuffle') return 0.14 * beatMs;
    return (feel === 'swing-heavy' ? 0.16 : 0.09) * beatMs;
  }

  public async playExercise(
    events: PlaybackEvent[], bpm: number, isBass: boolean, onEvent: (index: number) => void,
    onComplete?: () => void, feelOverride?: Microtiming | 'exercise',
    loop: boolean = false, cycleBeats: number = 4
  ) {
    await this.ensureContext();
    this.initSynthBackground();
    this.stopExercise(false);
    if (!events.length) return;

    this.isExercisePlaying = true;
    let loopStart = performance.now();
    let timer: number | null = null;
    const finish = () => {
      if (timer !== null) window.clearTimeout(timer);
      this.isExercisePlaying = false;
      onComplete?.();
      this.onExerciseStopCallbacks.forEach(cb => cb());
    };
    const scheduleCycle = () => {
      loopStart = performance.now();
      const scheduleNext = (index: number) => {
        if (!this.isExercisePlaying) return;
        if (index >= events.length) {
          if (loop) {
            const cycleMs = (60 / bpm) * 1000 * Math.max(1, cycleBeats);
            const remaining = Math.max(10, cycleMs - (performance.now() - loopStart));
            timer = window.setTimeout(() => {
              if (this.isExercisePlaying) scheduleCycle();
            }, remaining);
            this.exerciseTimerId = timer;
          } else {
            const lastEvent = events[events.length - 1];
            const lastQuarter = durationToQuarterUnits(lastEvent?.duration || 'q') || 1;
            const lastDurationMs = (60 / bpm) * 1000 * lastQuarter;
            timer = window.setTimeout(() => {
              if (this.isExercisePlaying) finish();
            }, lastDurationMs);
            this.exerciseTimerId = timer;
          }
          return;
        }
        const e = events[index];
        const feel = feelOverride && feelOverride !== 'exercise' ? feelOverride : e.notes.find(n => n.microtiming)?.microtiming;
        const nominalMs = (60 / bpm) * 1000 * e.startBeat;
        const offsetMs = this.microtimingOffsetMs(feel, bpm, e.startBeat);
        const delay = Math.max(0, nominalMs + offsetMs - (performance.now() - loopStart));
        timer = window.setTimeout(() => {
          if (!this.isExercisePlaying) return;
          const durationSec = Math.max(0.06, (60 / bpm) * (durationToQuarterUnits(e.duration) || 0.25) * 0.92);
          for (const note of e.notes) {
            const isRest = note.isRest ?? isRestDuration(note.duration);
            if (!isRest) this.playStringNote(note.midi, isBass, durationSec, note.velocity ?? 100, note.accent ?? 'normal');
          }
          onEvent(index);
          scheduleNext(index + 1);
        }, delay);
        this.exerciseTimerId = timer;
      };
      scheduleNext(0);
    };
    scheduleCycle();
  }

  public stopExercise(notify = true) {
    this.isExercisePlaying = false;
    if (this.exerciseTimerId !== null) { window.clearTimeout(this.exerciseTimerId); this.exerciseTimerId = null; }

    if (this.isSynthReady && this.synth) {
      try { this.synth.stopAll(); } catch {}
    }

    if (notify) this.onExerciseStopCallbacks.forEach(cb => cb());
  }
  public isExerciseActive() { return this.isExercisePlaying; }
  public isMetronomeActive() { return this.isMetronomePlaying; }
  public subscribeBeat(cb: (beat: number) => void) { this.onBeatCallbacks.add(cb); return () => this.onBeatCallbacks.delete(cb); }
  public subscribeExerciseStop(cb: () => void) { this.onExerciseStopCallbacks.add(cb); return () => this.onExerciseStopCallbacks.delete(cb); }
}

export const soundEngine = new SoundEngine();

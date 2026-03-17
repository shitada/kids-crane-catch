import type { SFXType } from '@/types/index';

export type BGMType = 'title' | 'game';

interface MelodyNote {
  freq: number[];   // chord frequencies
  duration: number;  // seconds
}

const TITLE_MELODY: MelodyNote[] = [
  { freq: [262, 330, 392], duration: 0.4 },
  { freq: [294, 370, 440], duration: 0.4 },
  { freq: [330, 392, 494], duration: 0.4 },
  { freq: [349, 440, 523], duration: 0.6 },
  { freq: [330, 392, 494], duration: 0.4 },
  { freq: [294, 370, 440], duration: 0.4 },
  { freq: [262, 330, 392], duration: 0.8 },
  { freq: [196, 247, 294], duration: 0.4 },
  { freq: [220, 277, 330], duration: 0.4 },
  { freq: [247, 311, 370], duration: 0.4 },
  { freq: [262, 330, 392], duration: 0.6 },
  { freq: [247, 311, 370], duration: 0.4 },
  { freq: [220, 277, 330], duration: 0.4 },
  { freq: [196, 247, 294], duration: 0.8 },
];

const GAME_MELODY: MelodyNote[] = [
  { freq: [330, 415, 494], duration: 0.25 },
  { freq: [370, 466, 554], duration: 0.25 },
  { freq: [415, 523, 622], duration: 0.25 },
  { freq: [494, 622, 740], duration: 0.5 },
  { freq: [466, 587, 698], duration: 0.25 },
  { freq: [415, 523, 622], duration: 0.25 },
  { freq: [370, 466, 554], duration: 0.5 },
  { freq: [330, 415, 494], duration: 0.25 },
  { freq: [294, 370, 440], duration: 0.25 },
  { freq: [330, 415, 494], duration: 0.25 },
  { freq: [370, 466, 554], duration: 0.5 },
  { freq: [330, 415, 494], duration: 0.25 },
  { freq: [294, 370, 440], duration: 0.25 },
  { freq: [262, 330, 392], duration: 0.5 },
  { freq: [294, 370, 440], duration: 0.25 },
  { freq: [330, 415, 494], duration: 0.5 },
];

export class AudioManager {
  private context: AudioContext | null = null;
  private bgmEnabled = true;
  private sfxEnabled = true;
  private bgmGain: GainNode | null = null;
  private bgmScheduler: number | null = null;
  private bgmOscillators: OscillatorNode[] = [];
  private currentBGM: BGMType | null = null;

  initialize(): void {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.context = new Ctx();
  }

  playSFX(type: SFXType): void {
    if (!this.sfxEnabled || !this.context) return;

    const ctx = this.context;
    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    switch (type) {
      case 'catchSuccess':
        this.playTone(ctx, gain, [523.25, 659.25, 783.99], 0.15, 0.5);
        break;
      case 'catchFail':
        this.playTone(ctx, gain, [330], 0.3, 0.3);
        break;
      case 'buttonTap':
        this.playTone(ctx, gain, [880], 0.05, 0.2);
        break;
      case 'craneMove':
        this.playTone(ctx, gain, [220], 0.05, 0.1);
        break;
      case 'armDrop':
        this.playTone(ctx, gain, [440, 330, 220], 0.1, 0.3);
        break;
      case 'complete':
        this.playTone(ctx, gain, [523.25, 659.25, 783.99, 1046.5], 0.2, 0.8);
        break;
      case 'transition':
        this.playTone(ctx, gain, [440, 550], 0.1, 0.2);
        break;
    }
  }

  playBGM(type: BGMType = 'game'): void {
    if (!this.bgmEnabled || !this.context) return;
    if (this.currentBGM === type) return;

    this.stopBGM();
    this.currentBGM = type;

    const ctx = this.context;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0;
    this.bgmGain.connect(ctx.destination);

    // Fade in
    this.bgmGain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.5);

    const melody = type === 'title' ? TITLE_MELODY : GAME_MELODY;
    this.scheduleMelodyLoop(ctx, melody);
  }

  stopBGM(): void {
    if (this.bgmScheduler !== null) {
      clearTimeout(this.bgmScheduler);
      this.bgmScheduler = null;
    }
    for (const osc of this.bgmOscillators) {
      try { osc.stop(); osc.disconnect(); } catch { /* ignore */ }
    }
    this.bgmOscillators = [];
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
    this.currentBGM = null;
  }

  setBGMEnabled(enabled: boolean): void {
    this.bgmEnabled = enabled;
    if (!enabled) this.stopBGM();
  }

  setSFXEnabled(enabled: boolean): void {
    this.sfxEnabled = enabled;
  }

  async resume(): Promise<void> {
    if (this.context && this.context.state === 'suspended') {
      await this.context.resume();
    }
  }

  dispose(): void {
    this.stopBGM();
    if (this.context) {
      this.context.close();
      this.context = null;
    }
  }

  private scheduleMelodyLoop(ctx: AudioContext, melody: MelodyNote[]): void {
    let offset = 0;
    const now = ctx.currentTime;

    for (const note of melody) {
      for (const freq of note.freq) {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;

        const noteGain = ctx.createGain();
        noteGain.gain.setValueAtTime(0.3, now + offset);
        noteGain.gain.exponentialRampToValueAtTime(0.01, now + offset + note.duration * 0.9);

        osc.connect(noteGain);
        noteGain.connect(this.bgmGain!);
        osc.start(now + offset);
        osc.stop(now + offset + note.duration);
        this.bgmOscillators.push(osc);
      }
      offset += note.duration;
    }

    // Schedule next loop
    const loopDuration = offset * 1000;
    this.bgmScheduler = window.setTimeout(() => {
      // Clean up finished oscillators
      this.bgmOscillators = [];
      if (this.currentBGM && this.context && this.bgmGain) {
        this.scheduleMelodyLoop(this.context, melody);
      }
    }, loopDuration - 50);
  }

  private playTone(ctx: AudioContext, gain: GainNode, frequencies: number[], noteLength: number, totalDuration: number): void {
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + totalDuration);

    let offset = 0;
    for (const freq of frequencies) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(now + offset);
      osc.stop(now + offset + noteLength);
      offset += noteLength;
    }
  }
}

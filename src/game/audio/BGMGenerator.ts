import { AudioManager } from './AudioManager';

export type BGMMode = 'title' | 'play' | 'result';

/**
 * 和音ベースのプロシージャルBGM生成
 * - title: ワクワクする楽しいコード進行（C→F→G→C）
 * - play: 落ち着いた穏やかなコード進行（Am→F→C→G）
 */
export class BGMGenerator {
  private audioManager: AudioManager;
  private playing = false;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
  }

  start(mode: BGMMode = 'title'): void {
    if (this.playing) return;
    const ctx = this.audioManager.getContext();
    const dest = this.audioManager.getBGMGain();
    if (!ctx || !dest) return;

    this.playing = true;

    if (mode === 'title') {
      this.playTitleBGM(ctx, dest);
    } else if (mode === 'result') {
      this.playResultBGM(ctx, dest);
    } else {
      this.playGameBGM(ctx, dest);
    }
  }

  /** ホーム画面BGM: ワクワクする明るい和音進行 */
  private playTitleBGM(ctx: AudioContext, dest: GainNode): void {
    const chords = [
      [261.6, 329.6, 392.0],  // C (ド ミ ソ)
      [349.2, 440.0, 523.3],  // F (ファ ラ ド)
      [392.0, 493.9, 587.3],  // G (ソ シ レ)
      [523.3, 659.3, 784.0],  // C high (ド ミ ソ)
    ];
    const melody = [
      523, 659, 784, 659,
      698, 880, 1047, 880,
      784, 988, 1175, 988,
      1047, 784, 659, 523,
    ];

    const chordDur = 0.9;
    const melodyNote = chordDur / 4;
    const loopDur = chords.length * chordDur;

    const playLoop = () => {
      if (!this.playing) return;
      const time = ctx.currentTime + 0.05;

      for (let ci = 0; ci < chords.length; ci++) {
        const chord = chords[ci];
        for (const freq of chord) {
          this.scheduleNote(ctx, dest, freq, 'triangle', time + ci * chordDur, chordDur * 0.85, 0.06);
        }
        this.scheduleNote(ctx, dest, chord[0] / 2, 'sine', time + ci * chordDur, chordDur * 0.7, 0.05);
      }

      for (let mi = 0; mi < melody.length; mi++) {
        this.scheduleNote(ctx, dest, melody[mi], 'sine', time + mi * melodyNote, melodyNote * 0.7, 0.1);
      }

      this.timerId = setTimeout(playLoop, loopDur * 1000);
    };

    playLoop();
  }

  /** 結果画面BGM: 達成感のあるファンファーレ風和音 */
  private playResultBGM(ctx: AudioContext, dest: GainNode): void {
    const chords = [
      [261.6, 329.6, 392.0],  // C (ド ミ ソ)
      [293.7, 370.0, 440.0],  // D (レ ファ# ラ)
      [349.2, 440.0, 523.3],  // F (ファ ラ ド)
      [392.0, 493.9, 587.3],  // G (ソ シ レ)
      [523.3, 659.3, 784.0],  // C high (ド ミ ソ)
    ];
    const melody = [
      523, 587, 659, 784,
      880, 784, 880, 1047,
      880, 784, 659, 784,
      880, 1047, 1175, 1047,
      1319, 1047, 880, 784,
    ];

    const chordDur = 1.0;
    const melodyNote = chordDur / 4;
    const loopDur = chords.length * chordDur;

    const playLoop = () => {
      if (!this.playing) return;
      const time = ctx.currentTime + 0.05;

      for (let ci = 0; ci < chords.length; ci++) {
        const chord = chords[ci];
        for (const freq of chord) {
          this.scheduleNote(ctx, dest, freq, 'triangle', time + ci * chordDur, chordDur * 0.85, 0.055);
        }
        this.scheduleNote(ctx, dest, chord[0] / 2, 'sine', time + ci * chordDur, chordDur * 0.7, 0.045);
      }

      for (let mi = 0; mi < melody.length; mi++) {
        this.scheduleNote(ctx, dest, melody[mi], 'sine', time + mi * melodyNote, melodyNote * 0.7, 0.09);
      }

      this.timerId = setTimeout(playLoop, loopDur * 1000);
    };

    playLoop();
  }

  /** ゲーム画面BGM: 落ち着いた穏やかな和音進行 */
  private playGameBGM(ctx: AudioContext, dest: GainNode): void {
    const chords = [
      [220.0, 261.6, 329.6],  // Am (ラ ド ミ)
      [174.6, 220.0, 261.6],  // F  (ファ ラ ド)
      [261.6, 329.6, 392.0],  // C  (ド ミ ソ)
      [196.0, 246.9, 293.7],  // G  (ソ シ レ)
    ];
    const melody = [
      329, 392, 440, 392,
      261, 349, 440, 349,
      329, 392, 523, 392,
      293, 392, 493, 392,
    ];

    const chordDur = 1.2;
    const melodyNote = chordDur / 4;
    const loopDur = chords.length * chordDur;

    const playLoop = () => {
      if (!this.playing) return;
      const time = ctx.currentTime + 0.05;

      for (let ci = 0; ci < chords.length; ci++) {
        const chord = chords[ci];
        for (const freq of chord) {
          this.scheduleNote(ctx, dest, freq, 'sine', time + ci * chordDur, chordDur * 0.9, 0.045);
        }
        this.scheduleNote(ctx, dest, chord[0] / 2, 'sine', time + ci * chordDur, chordDur * 0.7, 0.035);
      }

      for (let mi = 0; mi < melody.length; mi++) {
        this.scheduleNote(ctx, dest, melody[mi], 'triangle', time + mi * melodyNote, melodyNote * 0.6, 0.07);
      }

      this.timerId = setTimeout(playLoop, loopDur * 1000);
    };

    playLoop();
  }

  private scheduleNote(
    ctx: AudioContext,
    dest: GainNode,
    freq: number,
    type: OscillatorType,
    startTime: number,
    duration: number,
    volume: number,
  ): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume, startTime + 0.03);
    gain.gain.setValueAtTime(volume, startTime + duration * 0.6);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(dest);
    osc.start(startTime);
    osc.stop(startTime + duration + 0.01);

    this.activeNodes.push({ osc, gain });

    osc.onended = () => {
      const idx = this.activeNodes.findIndex(n => n.osc === osc);
      if (idx >= 0) this.activeNodes.splice(idx, 1);
    };
  }

  stop(): void {
    this.playing = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    for (const { osc } of this.activeNodes) {
      try { osc.stop(); } catch { /* already stopped */ }
    }
    this.activeNodes = [];
  }
}

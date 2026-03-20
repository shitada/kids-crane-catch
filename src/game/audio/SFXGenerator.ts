import type { SFXType } from '../../types';
import { AudioManager } from './AudioManager';

export class SFXGenerator {
  private audioManager: AudioManager;

  constructor(audioManager: AudioManager) {
    this.audioManager = audioManager;
  }

  play(type: SFXType): void {
    const ctx = this.audioManager.getContext();
    const gain = this.audioManager.getSFXGain();
    if (!ctx || !gain) return;

    switch (type) {
      case 'catchSuccess': this.playCatchSuccess(ctx, gain); break;
      case 'catchFail': this.playCatchFail(ctx, gain); break;
      case 'buttonTap': this.playButtonTap(ctx, gain); break;
      case 'drop': this.playDrop(ctx, gain); break;
      case 'itemDrop': this.playItemDrop(ctx, gain); break;
      // のりもの
      case 'shinkansen': this.playShinkansen(ctx, gain); break;
      case 'airplane': this.playAirplane(ctx, gain); break;
      case 'bus': this.playBus(ctx, gain); break;
      case 'policeCar': this.playPoliceCar(ctx, gain); break;
      case 'excavator': this.playExcavator(ctx, gain); break;
      case 'helicopter': this.playHelicopter(ctx, gain); break;
      case 'rocket': this.playRocket(ctx, gain); break;
      case 'ship': this.playShip(ctx, gain); break;
      // うみのいきもの
      case 'whale': this.playTone(ctx, gain, [120, 80], 'sine', 1.0); break;
      case 'dolphin': this.playTone(ctx, gain, [1200, 800, 1400], 'sine', 0.8); break;
      case 'clownfish': this.playTone(ctx, gain, [600, 700, 600], 'sine', 0.5); break;
      case 'octopus': this.playTone(ctx, gain, [300, 200, 150], 'sine', 0.6); break;
      case 'seaTurtle': this.playTone(ctx, gain, [200, 250, 200], 'triangle', 0.8); break;
      case 'jellyfish': this.playTone(ctx, gain, [800, 1000, 800], 'sine', 0.7); break;
      case 'manta': this.playTone(ctx, gain, [150, 200, 150], 'triangle', 0.9); break;
      case 'seahorse': this.playTone(ctx, gain, [500, 600, 500], 'sine', 0.5); break;
      // こっき
      case 'flagJapan': this.playFanfare(ctx, gain, [523, 659, 784]); break;
      case 'flagUSA': this.playFanfare(ctx, gain, [392, 523, 659]); break;
      case 'flagBrazil': this.playFanfare(ctx, gain, [440, 554, 659]); break;
      case 'flagFrance': this.playFanfare(ctx, gain, [349, 440, 523]); break;
      case 'flagChina': this.playFanfare(ctx, gain, [392, 494, 587]); break;
      case 'flagAustralia': this.playFanfare(ctx, gain, [330, 440, 554]); break;
      case 'flagIndia': this.playFanfare(ctx, gain, [294, 392, 494]); break;
      case 'flagKorea': this.playFanfare(ctx, gain, [370, 466, 554]); break;
      // がっき
      case 'piano': this.playChord(ctx, gain, [262, 330, 392], 'sine'); break;
      case 'guitar': this.playChord(ctx, gain, [330, 440, 554], 'triangle'); break;
      case 'taiko': this.playTone(ctx, gain, [100, 60], 'sine', 0.5); break;
      case 'trumpet': this.playFanfare(ctx, gain, [523, 659, 784, 1047]); break;
      case 'violin': this.playChord(ctx, gain, [440, 554, 659], 'sawtooth'); break;
      case 'harmonica': this.playChord(ctx, gain, [523, 659, 784], 'square'); break;
      case 'cymbal': this.playTone(ctx, gain, [2000, 1500, 800], 'sawtooth', 0.8); break;
      case 'recorder': this.playTone(ctx, gain, [784, 880, 784, 659], 'sine', 0.8); break;
      // きょうりゅう
      case 'trex': this.playTone(ctx, gain, [80, 60, 40], 'sawtooth', 1.0); break;
      case 'triceratops': this.playTone(ctx, gain, [150, 120, 100], 'triangle', 0.8); break;
      case 'stegosaurus': this.playTone(ctx, gain, [200, 180, 160], 'triangle', 0.7); break;
      case 'pteranodon': this.playTone(ctx, gain, [600, 800, 600], 'sine', 0.8); break;
      case 'brachiosaurus': this.playTone(ctx, gain, [100, 120, 80], 'sine', 1.0); break;
      case 'velociraptor': this.playTone(ctx, gain, [500, 700, 500, 700], 'sawtooth', 0.6); break;
      case 'ankylosaurus': this.playTone(ctx, gain, [120, 80, 120], 'triangle', 0.8); break;
      case 'parasaurolophus': this.playTone(ctx, gain, [200, 350, 200], 'sine', 1.2); break;
      // むし
      case 'beetleKabuto': this.playTone(ctx, gain, [120, 150, 120], 'sawtooth', 0.6); break;
      case 'beetleKuwagata': this.playTone(ctx, gain, [100, 130, 100], 'sawtooth', 0.6); break;
      case 'butterfly': this.playTone(ctx, gain, [800, 900, 800, 700], 'sine', 0.8); break;
      case 'ladybug': this.playTone(ctx, gain, [600, 700, 600], 'sine', 0.5); break;
      case 'dragonfly': this.playTone(ctx, gain, [500, 600, 700, 600], 'triangle', 0.7); break;
      case 'grasshopper': this.playTone(ctx, gain, [400, 500, 400, 500], 'square', 0.5); break;
      case 'firefly': this.playTone(ctx, gain, [1000, 1200, 1000], 'sine', 0.8); break;
      case 'mantis': this.playTone(ctx, gain, [300, 200, 300], 'sawtooth', 0.6); break;
    }
  }

  /** 汎用トーン再生（周波数配列を順に再生） */
  private playTone(ctx: AudioContext, dest: GainNode, freqs: number[], type: OscillatorType, duration: number): void {
    const t = ctx.currentTime;
    const step = duration / freqs.length;
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.2, t + i * step);
      g.gain.linearRampToValueAtTime(0, t + (i + 1) * step);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + i * step);
      osc.stop(t + (i + 1) * step);
    });
  }

  /** 和音再生 */
  private playChord(ctx: AudioContext, dest: GainNode, freqs: number[], type: OscillatorType): void {
    const t = ctx.currentTime;
    for (const freq of freqs) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.12, t);
      g.gain.linearRampToValueAtTime(0, t + 0.8);
      osc.connect(g);
      g.connect(dest);
      osc.start(t);
      osc.stop(t + 0.8);
    }
  }

  /** ファンファーレ（音階を上がる） */
  private playFanfare(ctx: AudioContext, dest: GainNode, notes: number[]): void {
    const t = ctx.currentTime;
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.2, t + i * 0.15);
      g.gain.linearRampToValueAtTime(0, t + i * 0.15 + 0.3);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + i * 0.15);
      osc.stop(t + i * 0.15 + 0.3);
    });
  }

  private playCatchSuccess(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Happy ascending arpeggio
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.3, t + i * 0.1);
      g.gain.linearRampToValueAtTime(0, t + i * 0.1 + 0.3);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + i * 0.1);
      osc.stop(t + i * 0.1 + 0.3);
    });
  }

  private playCatchFail(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Descending sad tones
    [400, 350, 300].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      g.gain.setValueAtTime(0.2, t + i * 0.15);
      g.gain.linearRampToValueAtTime(0, t + i * 0.15 + 0.25);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + i * 0.15);
      osc.stop(t + i * 0.15 + 0.25);
    });
  }

  private playButtonTap(ctx: AudioContext, dest: GainNode): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
    osc.connect(g);
    g.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  private playDrop(ctx: AudioContext, dest: GainNode): void {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.3);
    g.gain.setValueAtTime(0.3, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    osc.connect(g);
    g.connect(dest);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  private playItemDrop(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // ボックスにアイテムが落ちる「ドスン」という音
    const thud = ctx.createOscillator();
    const thudG = ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(150, t);
    thud.frequency.linearRampToValueAtTime(60, t + 0.15);
    thudG.gain.setValueAtTime(0.35, t);
    thudG.gain.linearRampToValueAtTime(0, t + 0.2);
    thud.connect(thudG);
    thudG.connect(dest);
    thud.start(t);
    thud.stop(t + 0.2);

    // 軽い「コトン」という衡撃音
    const tap = ctx.createOscillator();
    const tapG = ctx.createGain();
    tap.type = 'triangle';
    tap.frequency.setValueAtTime(400, t);
    tap.frequency.linearRampToValueAtTime(200, t + 0.08);
    tapG.gain.setValueAtTime(0.2, t);
    tapG.gain.linearRampToValueAtTime(0, t + 0.1);
    tap.connect(tapG);
    tapG.connect(dest);
    tap.start(t);
    tap.stop(t + 0.1);
  }

  // --- Vehicle-specific sounds ---

  private playShinkansen(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Whistle + running noise
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.3);
    g.gain.setValueAtTime(0.3, t);
    g.gain.linearRampToValueAtTime(0.1, t + 0.3);
    g.gain.linearRampToValueAtTime(0, t + 1.0);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.0);

    // Rail clatter
    const noise = ctx.createOscillator();
    const ng = ctx.createGain();
    noise.type = 'sawtooth';
    noise.frequency.value = 80;
    ng.gain.setValueAtTime(0.05, t + 0.2);
    ng.gain.linearRampToValueAtTime(0, t + 1.0);
    noise.connect(ng);
    ng.connect(dest);
    noise.start(t + 0.2);
    noise.stop(t + 1.0);
  }

  private playAirplane(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(200, t + 0.5);
    osc.frequency.linearRampToValueAtTime(150, t + 1.2);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.15, t + 0.3);
    g.gain.linearRampToValueAtTime(0, t + 1.2);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  private playBus(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 60;
    g.gain.setValueAtTime(0.1, t);
    g.gain.setValueAtTime(0.15, t + 0.1);
    g.gain.setValueAtTime(0.1, t + 0.2);
    g.gain.linearRampToValueAtTime(0, t + 0.8);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 0.8);
  }

  private playPoliceCar(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    // Siren: alternating high-low
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.3);
    osc.frequency.linearRampToValueAtTime(800, t + 0.6);
    osc.frequency.linearRampToValueAtTime(1200, t + 0.9);
    osc.frequency.linearRampToValueAtTime(800, t + 1.2);
    g.gain.setValueAtTime(0.25, t);
    g.gain.linearRampToValueAtTime(0, t + 1.2);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.2);
  }

  private playExcavator(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Engine rumble
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 45;
    g.gain.setValueAtTime(0.12, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.5);
    g.gain.linearRampToValueAtTime(0, t + 1.0);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.0);

    // Hydraulic hiss
    const hiss = ctx.createOscillator();
    const hg = ctx.createGain();
    hiss.type = 'sawtooth';
    hiss.frequency.value = 2000;
    hg.gain.setValueAtTime(0, t + 0.3);
    hg.gain.linearRampToValueAtTime(0.05, t + 0.4);
    hg.gain.linearRampToValueAtTime(0, t + 0.7);
    hiss.connect(hg);
    hg.connect(dest);
    hiss.start(t + 0.3);
    hiss.stop(t + 0.7);
  }

  private playHelicopter(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Rotor chop
    for (let i = 0; i < 8; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.value = 150;
      g.gain.setValueAtTime(0.1, t + i * 0.12);
      g.gain.linearRampToValueAtTime(0, t + i * 0.12 + 0.06);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + i * 0.12);
      osc.stop(t + i * 0.12 + 0.06);
    }
  }

  private playRocket(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Countdown beeps
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 1000;
      g.gain.setValueAtTime(0.2, t + i * 0.3);
      g.gain.linearRampToValueAtTime(0, t + i * 0.3 + 0.1);
      osc.connect(g);
      g.connect(dest);
      osc.start(t + i * 0.3);
      osc.stop(t + i * 0.3 + 0.1);
    }
    // Launch roar
    const roar = ctx.createOscillator();
    const rg = ctx.createGain();
    roar.type = 'sawtooth';
    roar.frequency.setValueAtTime(80, t + 0.9);
    roar.frequency.linearRampToValueAtTime(200, t + 1.5);
    rg.gain.setValueAtTime(0, t + 0.9);
    rg.gain.linearRampToValueAtTime(0.2, t + 1.1);
    rg.gain.linearRampToValueAtTime(0, t + 1.5);
    roar.connect(rg);
    rg.connect(dest);
    roar.start(t + 0.9);
    roar.stop(t + 1.5);
  }

  private playShip(ctx: AudioContext, dest: GainNode): void {
    const t = ctx.currentTime;
    // Horn
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 180;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.25, t + 0.2);
    g.gain.linearRampToValueAtTime(0.25, t + 0.8);
    g.gain.linearRampToValueAtTime(0, t + 1.2);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(t + 1.2);
  }
}

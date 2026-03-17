import type { SFXType } from '@/types/index';

export class AudioManager {
  private context: AudioContext | null = null;
  private bgmEnabled = true;
  private sfxEnabled = true;
  private bgmOsc: OscillatorNode | null = null;
  private bgmGain: GainNode | null = null;

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

  playBGM(): void {
    if (!this.bgmEnabled || !this.context || this.bgmOsc) return;

    const ctx = this.context;
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0.08;
    this.bgmGain.connect(ctx.destination);

    this.bgmOsc = ctx.createOscillator();
    this.bgmOsc.type = 'sine';
    this.bgmOsc.frequency.value = 262;
    this.bgmOsc.connect(this.bgmGain);
    this.bgmOsc.start();
  }

  stopBGM(): void {
    if (this.bgmOsc) {
      this.bgmOsc.stop();
      this.bgmOsc.disconnect();
      this.bgmOsc = null;
    }
    if (this.bgmGain) {
      this.bgmGain.disconnect();
      this.bgmGain = null;
    }
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

export class AudioManager {
  private ctx: AudioContext | null = null;
  private initialized = false;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  init(): void {
    if (this.initialized) return;
    this.ctx = new AudioContext();
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.3;
    this.bgmGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.5;
    this.sfxGain.connect(this.ctx.destination);
    this.initialized = true;
  }

  ensureResumed(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  getContext(): AudioContext | null {
    return this.ctx;
  }

  getSFXGain(): GainNode | null {
    return this.sfxGain;
  }

  getBGMGain(): GainNode | null {
    return this.bgmGain;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

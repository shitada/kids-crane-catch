import * as THREE from 'three';
import { ParticleEffect } from '@/game/effects/ParticleEffect';
import type { AudioManager } from '@/game/audio/AudioManager';

export class CatchCelebration {
  private particles: ParticleEffect;
  private active = false;

  constructor(
    private scene: THREE.Scene,
    private audioManager: AudioManager,
  ) {
    this.particles = new ParticleEffect();
    this.scene.add(this.particles.getGroup());
  }

  playSuccess(position: THREE.Vector3): void {
    this.active = true;
    this.audioManager.playSFX('catchSuccess');

    // Colorful celebration particles
    const colors = [0xff6b6b, 0xffd93d, 0x6bcb77, 0x4d96ff, 0xff6bcb];
    for (const color of colors) {
      this.particles.spawn(
        { count: 5, color, size: 0.08, lifetime: 1.2, spread: 2, speed: 3 },
        position,
      );
    }
  }

  playFail(): void {
    this.active = true;
    this.audioManager.playSFX('catchFail');
  }

  update(deltaTime: number): void {
    if (!this.active) return;
    this.particles.update(deltaTime);
    if (!this.particles.isActive()) {
      this.active = false;
    }
  }

  isActive(): boolean {
    return this.active;
  }

  dispose(): void {
    this.particles.dispose();
    this.scene.remove(this.particles.getGroup());
  }
}

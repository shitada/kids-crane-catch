import * as THREE from 'three';

export interface ParticleConfig {
  count: number;
  color: number;
  size: number;
  lifetime: number;
  spread: number;
  speed: number;
}

interface Particle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;
}

export class ParticleEffect {
  private particles: Particle[] = [];
  private group: THREE.Group;

  constructor() {
    this.group = new THREE.Group();
  }

  getGroup(): THREE.Group {
    return this.group;
  }

  spawn(config: ParticleConfig, origin: THREE.Vector3): void {
    const geo = new THREE.SphereGeometry(config.size, 4, 4);
    const mat = new THREE.MeshToonMaterial({ color: config.color });

    for (let i = 0; i < config.count; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(origin);

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * config.spread,
        Math.random() * config.speed,
        (Math.random() - 0.5) * config.spread,
      );

      const particle: Particle = {
        mesh,
        velocity,
        life: config.lifetime,
        maxLife: config.lifetime,
      };

      this.particles.push(particle);
      this.group.add(mesh);
    }
  }

  update(deltaTime: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]!;
      p.life -= deltaTime;

      if (p.life <= 0) {
        this.group.remove(p.mesh);
        p.mesh.geometry.dispose();
        this.particles.splice(i, 1);
        continue;
      }

      p.mesh.position.add(p.velocity.clone().multiplyScalar(deltaTime));
      p.velocity.y -= 2 * deltaTime; // gravity

      const alpha = p.life / p.maxLife;
      p.mesh.scale.setScalar(alpha);
    }
  }

  dispose(): void {
    for (const p of this.particles) {
      this.group.remove(p.mesh);
      p.mesh.geometry.dispose();
    }
    this.particles = [];
  }

  isActive(): boolean {
    return this.particles.length > 0;
  }
}

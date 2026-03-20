import * as THREE from 'three';

/**
 * キャッチ失敗時のエフェクト（もやっとした煙）
 */
export class MissEffect {
  private particles: THREE.Points[] = [];
  private timers: number[] = [];

  play(position: THREE.Vector3, scene: THREE.Scene): void {
    const count = 10;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x + (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z + (Math.random() - 0.5) * 0.5;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.2,
      color: 0x888888,
      transparent: true,
      opacity: 0.6,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);
    this.particles.push(points);
    this.timers.push(0);
  }

  update(deltaTime: number, scene: THREE.Scene): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.timers[i] += deltaTime;
      const points = this.particles[i];
      const life = 1.0 - this.timers[i] / 0.8;

      if (life <= 0) {
        scene.remove(points);
        points.geometry.dispose();
        (points.material as THREE.PointsMaterial).dispose();
        this.particles.splice(i, 1);
        this.timers.splice(i, 1);
        continue;
      }

      // Float upward
      const positions = points.geometry.attributes.position as THREE.BufferAttribute;
      for (let j = 0; j < positions.count; j++) {
        positions.setY(j, positions.getY(j) + deltaTime * 1.5);
      }
      positions.needsUpdate = true;
      (points.material as THREE.PointsMaterial).opacity = life * 0.6;
    }
  }
}

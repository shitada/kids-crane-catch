import * as THREE from 'three';

/**
 * キャッチ成功時のパーティクルエフェクト（★キラキラ）
 */
export class CatchEffect {
  private particles: THREE.Points[] = [];
  private timers: number[] = [];

  play(position: THREE.Vector3, scene: THREE.Scene): void {
    const count = 20;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const starColors = [
      [1, 0.85, 0], // gold
      [1, 0.4, 0.4], // pink
      [0.4, 1, 0.4], // green
      [0.4, 0.8, 1], // blue
    ];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = position.x;
      positions[i * 3 + 1] = position.y;
      positions[i * 3 + 2] = position.z;

      const c = starColors[i % starColors.length];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 1,
    });

    const points = new THREE.Points(geo, mat);
    // Store velocities in userData
    const velocities: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 4,
        Math.random() * 3 + 1,
        (Math.random() - 0.5) * 4,
      ));
    }
    points.userData.velocities = velocities;
    points.userData.life = 1.0;

    scene.add(points);
    this.particles.push(points);
    this.timers.push(0);
  }

  update(deltaTime: number, scene: THREE.Scene): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.timers[i] += deltaTime;
      const points = this.particles[i];
      const life = 1.0 - this.timers[i] / 1.0;

      if (life <= 0) {
        scene.remove(points);
        points.geometry.dispose();
        (points.material as THREE.PointsMaterial).dispose();
        this.particles.splice(i, 1);
        this.timers.splice(i, 1);
        continue;
      }

      const positions = points.geometry.attributes.position as THREE.BufferAttribute;
      const vels = points.userData.velocities as THREE.Vector3[];

      for (let j = 0; j < vels.length; j++) {
        positions.setXYZ(
          j,
          positions.getX(j) + vels[j].x * deltaTime,
          positions.getY(j) + vels[j].y * deltaTime,
          positions.getZ(j) + vels[j].z * deltaTime,
        );
        vels[j].y -= 5 * deltaTime; // gravity
      }
      positions.needsUpdate = true;
      (points.material as THREE.PointsMaterial).opacity = life;
    }
  }
}

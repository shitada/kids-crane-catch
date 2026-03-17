import * as THREE from 'three';

export class CraneArm {
  readonly group: THREE.Group;
  private railX: THREE.Mesh;
  private railZ: THREE.Mesh;
  private armBody: THREE.Mesh;
  private ring: THREE.Mesh;
  private ringScale = 1.0;
  private targetRingScale = 1.0;

  constructor() {
    this.group = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });

    // Rail X (horizontal bar, left-right)
    const railXGeo = new THREE.BoxGeometry(8, 0.15, 0.15);
    this.railX = new THREE.Mesh(railXGeo, metalMat);
    this.railX.position.set(0, 4, 0);
    this.group.add(this.railX);

    // Rail Z (horizontal bar, front-back)
    const railZGeo = new THREE.BoxGeometry(0.15, 0.15, 4);
    this.railZ = new THREE.Mesh(railZGeo, metalMat);
    this.railZ.position.set(0, 4, 0);
    this.group.add(this.railZ);

    // Arm body (vertical bar)
    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
    this.armBody = new THREE.Mesh(armGeo, metalMat);
    this.armBody.position.set(0, 3, 0);
    this.group.add(this.armBody);

    // Ring (torus - circular grabber)
    const ringGeo = new THREE.TorusGeometry(0.3, 0.05, 12, 24);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });
    this.ring = new THREE.Mesh(ringGeo, ringMat);
    this.ring.position.set(0, 1.9, 0);
    this.ring.rotation.set(Math.PI / 2, 0, 0);
    this.group.add(this.ring);
  }

  setPositionX(x: number): void {
    this.armBody.position.x = x;
    this.ring.position.x = x;
    this.railZ.position.x = x;
  }

  setPositionZ(z: number): void {
    this.armBody.position.z = z;
    this.ring.position.z = z;
    this.railX.position.z = z;
  }

  setArmY(y: number): void {
    this.armBody.position.y = y + 1;
    this.armBody.scale.y = Math.max(0.1, (4 - y) / 2);
    this.ring.position.y = y - 0.1;
  }

  open(): void {
    this.targetRingScale = 1.0;
  }

  close(): void {
    this.targetRingScale = 0.3;
  }

  update(deltaTime: number): void {
    const speed = 2;
    if (Math.abs(this.ringScale - this.targetRingScale) > 0.01) {
      this.ringScale += (this.targetRingScale - this.ringScale) * speed * deltaTime * 5;
    }
    this.ring.scale.set(this.ringScale, this.ringScale, 1);
  }

  dispose(): void {
    this.railX.geometry.dispose();
    this.railZ.geometry.dispose();
    this.armBody.geometry.dispose();
    this.ring.geometry.dispose();
  }
}

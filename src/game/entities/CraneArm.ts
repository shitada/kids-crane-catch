import * as THREE from 'three';

export class CraneArm {
  readonly group: THREE.Group;
  private railX: THREE.Mesh;
  private railZ: THREE.Mesh;
  private armBody: THREE.Mesh;
  private ringLeft: THREE.Mesh;
  private ringRight: THREE.Mesh;
  private ringGroup: THREE.Group;
  private openAngle = 0;
  private targetOpenAngle = 0;

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

    // Ring group (two half-arcs that open/close like scissors)
    this.ringGroup = new THREE.Group();
    this.ringGroup.position.set(0, 1.9, 0);

    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffcc00 });

    // Left half-ring
    const halfRingGeo = new THREE.TorusGeometry(0.3, 0.05, 12, 12, Math.PI);
    this.ringLeft = new THREE.Mesh(halfRingGeo, ringMat);
    this.ringLeft.rotation.set(Math.PI / 2, 0, 0);
    this.ringGroup.add(this.ringLeft);

    // Right half-ring
    this.ringRight = new THREE.Mesh(halfRingGeo, ringMat);
    this.ringRight.rotation.set(Math.PI / 2, Math.PI, 0);
    this.ringGroup.add(this.ringRight);

    this.group.add(this.ringGroup);
  }

  setPositionX(x: number): void {
    this.armBody.position.x = x;
    this.ringGroup.position.x = x;
    this.railZ.position.x = x;
  }

  setPositionZ(z: number): void {
    this.armBody.position.z = z;
    this.ringGroup.position.z = z;
    this.railX.position.z = z;
  }

  setArmY(y: number): void {
    this.armBody.position.y = y + 1;
    this.armBody.scale.y = Math.max(0.1, (4 - y) / 2);
    this.ringGroup.position.y = y - 0.1;
  }

  open(): void {
    this.targetOpenAngle = 0.4;
  }

  close(): void {
    this.targetOpenAngle = 0;
  }

  update(deltaTime: number): void {
    const speed = 3;
    if (Math.abs(this.openAngle - this.targetOpenAngle) > 0.005) {
      this.openAngle += (this.targetOpenAngle - this.openAngle) * speed * deltaTime * 5;
    } else {
      this.openAngle = this.targetOpenAngle;
    }
    // Spread the half-rings apart
    this.ringLeft.position.x = -this.openAngle;
    this.ringRight.position.x = this.openAngle;
  }

  dispose(): void {
    this.railX.geometry.dispose();
    this.railZ.geometry.dispose();
    this.armBody.geometry.dispose();
    this.ringLeft.geometry.dispose();
    this.ringRight.geometry.dispose();
  }
}

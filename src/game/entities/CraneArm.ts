import * as THREE from 'three';

export class CraneArm {
  readonly group: THREE.Group;
  private rail: THREE.Mesh;
  private armBody: THREE.Mesh;
  private clawLeft: THREE.Mesh;
  private clawRight: THREE.Mesh;
  private armOpen = 0.3;
  private targetArmOpen = 0.3;

  constructor() {
    this.group = new THREE.Group();

    // Rail (horizontal bar at top)
    const railGeo = new THREE.BoxGeometry(8, 0.15, 0.15);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    this.rail = new THREE.Mesh(railGeo, metalMat);
    this.rail.position.set(0, 4, 0);
    this.group.add(this.rail);

    // Arm body (vertical bar)
    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
    this.armBody = new THREE.Mesh(armGeo, metalMat);
    this.armBody.position.set(0, 3, 0);
    this.group.add(this.armBody);

    // Claws
    const clawGeo = new THREE.ConeGeometry(0.08, 0.5, 6);
    const clawMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });
    this.clawLeft = new THREE.Mesh(clawGeo, clawMat);
    this.clawLeft.position.set(-0.15, 1.9, 0);
    this.clawLeft.rotation.set(0, 0, 0.3);
    this.group.add(this.clawLeft);

    this.clawRight = new THREE.Mesh(clawGeo, clawMat);
    this.clawRight.position.set(0.15, 1.9, 0);
    this.clawRight.rotation.set(0, 0, -0.3);
    this.group.add(this.clawRight);
  }

  setPositionX(x: number): void {
    this.armBody.position.x = x;
    this.clawLeft.position.x = x - this.armOpen;
    this.clawRight.position.x = x + this.armOpen;
  }

  setArmY(y: number): void {
    this.armBody.position.y = y + 1;
    this.armBody.scale.y = Math.max(0.1, (4 - y) / 2);
    this.clawLeft.position.y = y - 0.1;
    this.clawRight.position.y = y - 0.1;
  }

  open(): void {
    this.targetArmOpen = 0.3;
  }

  close(): void {
    this.targetArmOpen = 0.05;
  }

  update(deltaTime: number): void {
    const speed = 2;
    if (Math.abs(this.armOpen - this.targetArmOpen) > 0.01) {
      this.armOpen += (this.targetArmOpen - this.armOpen) * speed * deltaTime * 5;
    }
    const x = this.armBody.position.x;
    this.clawLeft.position.x = x - this.armOpen;
    this.clawRight.position.x = x + this.armOpen;
    this.clawLeft.rotation.z = this.armOpen;
    this.clawRight.rotation.z = -this.armOpen;
  }

  dispose(): void {
    this.rail.geometry.dispose();
    this.armBody.geometry.dispose();
    this.clawLeft.geometry.dispose();
    this.clawRight.geometry.dispose();
  }
}

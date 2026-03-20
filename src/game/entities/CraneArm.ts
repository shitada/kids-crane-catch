import * as THREE from 'three';

export class CraneArm {
  readonly group: THREE.Group;
  private railX: THREE.Mesh;
  private railZ: THREE.Mesh;
  private armBody: THREE.Mesh;
  private prongGroupL: THREE.Group;
  private prongGroupR: THREE.Group;
  private clawGroup: THREE.Group;
  private openAngle = 0;
  private targetOpenAngle = 0;

  constructor() {
    this.group = new THREE.Group();

    const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const clawMat = new THREE.MeshStandardMaterial({ color: 0xcccccc });

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

    // Arm body (vertical shaft)
    const armGeo = new THREE.CylinderGeometry(0.06, 0.06, 2, 8);
    this.armBody = new THREE.Mesh(armGeo, metalMat);
    this.armBody.position.set(0, 3, 0);
    this.group.add(this.armBody);

    // Claw group (attached to bottom of shaft)
    this.clawGroup = new THREE.Group();
    this.clawGroup.position.set(0, 1.9, 0);

    // Hinge base (small sphere at connection point)
    const hingeGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const hinge = new THREE.Mesh(hingeGeo, metalMat);
    this.clawGroup.add(hinge);

    // Left prong — pivot at top, arm extends downward
    this.prongGroupL = this.createProng(clawMat, -1);
    this.clawGroup.add(this.prongGroupL);

    // Right prong — pivot at top, arm extends downward
    this.prongGroupR = this.createProng(clawMat, 1);
    this.clawGroup.add(this.prongGroupR);

    this.group.add(this.clawGroup);
  }

  private createProng(material: THREE.Material, side: number): THREE.Group {
    const prong = new THREE.Group();
    // Pivot is at (0,0,0) of the group — the hinge point

    // Upper arm segment (straight bar going down and outward)
    const upperGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.45, 6);
    const upper = new THREE.Mesh(upperGeo, material);
    upper.position.set(side * 0.05, -0.22, 0);
    prong.add(upper);

    // Lower tip (curved inward at bottom) — a smaller angled segment
    const tipGeo = new THREE.CylinderGeometry(0.03, 0.02, 0.18, 6);
    const tip = new THREE.Mesh(tipGeo, material);
    tip.position.set(side * 0.02, -0.48, 0);
    tip.rotation.z = side * 0.6; // angle inward
    prong.add(tip);

    // Small sphere at the very tip for rounded claw end
    const tipCapGeo = new THREE.SphereGeometry(0.03, 6, 6);
    const tipCap = new THREE.Mesh(tipCapGeo, material);
    tipCap.position.set(side * -0.01, -0.54, 0);
    prong.add(tipCap);

    return prong;
  }

  setPositionX(x: number): void {
    this.armBody.position.x = x;
    this.clawGroup.position.x = x;
    this.railZ.position.x = x;
  }

  setPositionZ(z: number): void {
    this.armBody.position.z = z;
    this.clawGroup.position.z = z;
    this.railX.position.z = z;
  }

  setArmY(y: number): void {
    this.armBody.position.y = y + 1;
    this.armBody.scale.y = Math.max(0.1, (4 - y) / 2);
    this.clawGroup.position.y = y - 0.1;
  }

  open(): void {
    this.targetOpenAngle = 0.5; // V-shape spread
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
    // Rotate prongs around Z axis at hinge point
    this.prongGroupL.rotation.z = this.openAngle;
    this.prongGroupR.rotation.z = -this.openAngle;
  }

  dispose(): void {
    this.railX.geometry.dispose();
    this.railZ.geometry.dispose();
    this.armBody.geometry.dispose();
    this.clawGroup.traverse((child) => {
      if (child instanceof THREE.Mesh) child.geometry.dispose();
    });
  }
}

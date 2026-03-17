import * as THREE from 'three';
import type { ItemDefinition, PartDefinition } from '@/types/index';

const geometryMap: Record<string, new (...args: number[]) => THREE.BufferGeometry> = {
  sphere: THREE.SphereGeometry as unknown as new (...args: number[]) => THREE.BufferGeometry,
  box: THREE.BoxGeometry as unknown as new (...args: number[]) => THREE.BufferGeometry,
  cylinder: THREE.CylinderGeometry as unknown as new (...args: number[]) => THREE.BufferGeometry,
  cone: THREE.ConeGeometry as unknown as new (...args: number[]) => THREE.BufferGeometry,
  torus: THREE.TorusGeometry as unknown as new (...args: number[]) => THREE.BufferGeometry,
};

export class ItemFactory {
  create(item: ItemDefinition): THREE.Group {
    const group = new THREE.Group();

    for (const part of item.modelParams.parts) {
      const mesh = this.createPart(part);
      group.add(mesh);
    }

    const s = item.modelParams.scale;
    group.scale.set(s, s, s);

    return group;
  }

  private createPart(part: PartDefinition): THREE.Mesh {
    const GeoCtor = geometryMap[part.shape] ?? THREE.SphereGeometry;
    const geometry = new GeoCtor();
    const material = new THREE.MeshToonMaterial({ color: part.color });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(part.position[0], part.position[1], part.position[2]);
    mesh.scale.set(part.scale[0], part.scale[1], part.scale[2]);

    if (part.rotation) {
      mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
    }

    return mesh;
  }
}

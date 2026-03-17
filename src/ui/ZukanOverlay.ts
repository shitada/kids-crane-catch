import * as THREE from 'three';
import { ItemFactory } from '@/game/entities/ItemFactory';
import type { ItemDefinition } from '@/types/index';

export class ZukanOverlay {
  private overlay: HTMLElement | null = null;
  private itemMesh: THREE.Group | null = null;
  private itemFactory: ItemFactory;
  private animFrameId = 0;

  constructor(
    private container: HTMLElement,
    private scene: THREE.Scene,
  ) {
    this.itemFactory = new ItemFactory();
  }

  show(item: ItemDefinition): void {
    this.hide();

    // 3D model
    this.itemMesh = this.itemFactory.create(item);
    this.itemMesh.position.set(0, 0.5, 0);
    this.scene.add(this.itemMesh);

    // HTML overlay
    this.overlay = document.createElement('div');
    this.overlay.className = 'zukan-detail-overlay';
    this.overlay.style.cssText = `
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      display: flex; flex-direction: column; align-items: center;
      justify-content: flex-end; z-index: 200; pointer-events: none;
      padding-bottom: 20px;
    `;

    const rarityLabel = item.rarity === 'legendary' ? '⭐⭐⭐' : item.rarity === 'rare' ? '⭐⭐' : '⭐';

    this.overlay.innerHTML = `
      <div style="background: rgba(255,255,255,0.95); border-radius: 20px; padding: 20px; text-align: center; pointer-events: auto; max-width: 350px; width: 90%;">
        <div style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 5px;">${this.escapeHtml(item.name)}</div>
        <div style="font-size: 14px; color: #999; margin-bottom: 8px;">${rarityLabel}</div>
        <div style="font-size: 16px; color: #666; line-height: 1.6; margin-bottom: 15px;">${this.escapeHtml(item.description)}</div>
        <button class="zukan-close-btn" style="background: #4d96ff; color: #fff; border: none; border-radius: 12px; padding: 12px 30px; font-size: 18px; font-weight: bold; cursor: pointer; min-width: 44px; min-height: 44px;">とじる</button>
      </div>
    `;

    const closeBtn = this.overlay.querySelector('.zukan-close-btn');
    closeBtn?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.hide();
    });

    this.container.appendChild(this.overlay);

    // Auto-rotate
    const rotate = () => {
      if (this.itemMesh) {
        this.itemMesh.rotation.y += 0.02;
      }
      this.animFrameId = requestAnimationFrame(rotate);
    };
    rotate();
  }

  hide(): void {
    cancelAnimationFrame(this.animFrameId);
    if (this.itemMesh) {
      this.scene.remove(this.itemMesh);
      this.itemMesh = null;
    }
    this.overlay?.remove();
    this.overlay = null;
  }

  isVisible(): boolean {
    return this.overlay !== null;
  }

  dispose(): void {
    this.hide();
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

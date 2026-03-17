import type { ItemDefinition } from '@/types/index';

export class ItemRegistry {
  private items = new Map<string, ItemDefinition>();

  register(item: ItemDefinition): void {
    this.items.set(item.id, item);
  }

  get(id: string): ItemDefinition | undefined {
    return this.items.get(id);
  }

  getByCategory(categoryId: string): readonly ItemDefinition[] {
    return [...this.items.values()].filter((i) => i.categoryId === categoryId);
  }

  getAll(): readonly ItemDefinition[] {
    return [...this.items.values()];
  }
}

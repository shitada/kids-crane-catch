import type { CategoryDefinition } from '@/types/index';

export class CategoryRegistry {
  private categories = new Map<string, CategoryDefinition>();

  register(category: CategoryDefinition): void {
    this.categories.set(category.id, category);
  }

  get(id: string): CategoryDefinition | undefined {
    return this.categories.get(id);
  }

  getAll(): readonly CategoryDefinition[] {
    return [...this.categories.values()].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  getUnlocked(): readonly CategoryDefinition[] {
    return this.getAll().filter((c) => c.unlocked);
  }
}

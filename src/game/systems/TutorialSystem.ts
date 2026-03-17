import type { SaveManager } from '@/game/storage/SaveManager';

interface TutorialStep {
  message: string;
  target: 'move-right' | 'move-left' | 'catch' | 'done';
}

const TUTORIAL_STEPS: readonly TutorialStep[] = [
  { message: 'くれーんを みぎに うごかしてみよう！', target: 'move-right' },
  { message: 'こんどは ひだりに うごかしてみよう！', target: 'move-left' },
  { message: 'つかむ ぼたんを おしてみよう！', target: 'catch' },
];

export class TutorialSystem {
  private currentStep = 0;
  private completed = false;
  private readonly saveManager: SaveManager;

  constructor(saveManager: SaveManager) {
    this.saveManager = saveManager;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }

  getTotalSteps(): number {
    return TUTORIAL_STEPS.length;
  }

  getCurrentMessage(): string {
    if (this.currentStep >= TUTORIAL_STEPS.length) {
      return 'じゅんび かんりょう！あそんでみよう！';
    }
    return TUTORIAL_STEPS[this.currentStep]!.message;
  }

  getCurrentTarget(): string {
    if (this.currentStep >= TUTORIAL_STEPS.length) return 'done';
    return TUTORIAL_STEPS[this.currentStep]!.target;
  }

  completeStep(): void {
    if (this.completed) return;
    this.currentStep++;
    if (this.currentStep >= TUTORIAL_STEPS.length) {
      this.completed = true;
      this.saveManager.setTutorialCompleted();
    }
  }

  isComplete(): boolean {
    return this.completed;
  }

  shouldSkip(): boolean {
    return this.saveManager.isTutorialCompleted();
  }
}

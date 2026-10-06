/**
 * Haptics.ts
 * Provides tactile haptic feedback for mobile and touchscreen devices.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'selection';

export function triggerHaptic(type: HapticType = 'light'): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate) {
    return;
  }

  try {
    switch (type) {
      case 'selection':
        navigator.vibrate(8);
        break;
      case 'light':
        navigator.vibrate(15);
        break;
      case 'medium':
        navigator.vibrate(28);
        break;
      case 'heavy':
        navigator.vibrate(45);
        break;
      case 'success':
        navigator.vibrate([20, 40, 30]);
        break;
      case 'warning':
        navigator.vibrate([40, 60, 40]);
        break;
    }
  } catch (e) {
    // Silently ignore if vibrations are disallowed by browser policies
  }
}

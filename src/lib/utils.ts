export const getLifecycleStage = (level: number, currentStage: string): string => {
  if (level >= 20) return 'legacy';
  if (level >= 15) return 'maturation';
  if (level >= 8) return 'specialization';
  if (level >= 3) return 'adaptation';
  return 'initialization';
};

export const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

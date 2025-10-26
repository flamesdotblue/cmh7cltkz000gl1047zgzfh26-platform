export function addXp(amount) {
  const current = Number(localStorage.getItem('xp') || '0');
  const next = current + amount;
  localStorage.setItem('xp', String(next));
  try { window.dispatchEvent(new Event('storage')); } catch {}
}

export function getLevelFromXp(xp) {
  // Simple curve: level up with a gentle progression
  return Math.floor(Math.sqrt(xp / 50)) + 1;
}

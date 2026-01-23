const KEY = "ascend_onboarding_v1";

export function getOnboarding() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { joinedCircle: false, joinedChallenge: false, posted: false };
    const parsed = JSON.parse(raw);
    return {
      joinedCircle: !!parsed.joinedCircle,
      joinedChallenge: !!parsed.joinedChallenge,
      posted: !!parsed.posted,
    };
  } catch {
    return { joinedCircle: false, joinedChallenge: false, posted: false };
  }
}

export function setOnboarding(next) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function markStep(stepKey) {
  const cur = getOnboarding();
  const next = { ...cur, [stepKey]: true };
  setOnboarding(next);
  return next;
}

export function resetOnboarding() {
  localStorage.removeItem(KEY);
}

export function isCompleted(o) {
  return o.joinedCircle && o.joinedChallenge && o.posted;
}

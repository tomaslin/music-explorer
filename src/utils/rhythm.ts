// Convert duration tokens to quarter-note units.
export function durationToQuarterUnits(duration: string | undefined): number {
  const token = (duration || '8').replace(/r$/, '');
  const dotted = token.endsWith('.') || token.endsWith('d');
  const base = dotted ? token.slice(0, -1) : token;
  const values: Record<string, number> = {
    '1': 4,
    'w': 4,
    '2': 2,
    'h': 2,
    '4': 1,
    'q': 1,
    '8': 0.5,
    '16': 0.25,
    '32': 0.125,
    '64': 0.0625,
  };
  const value = values[base] ?? 0.5;
  return dotted ? value * 1.5 : value;
}

export function isRestDuration(duration: string | undefined): boolean {
  return Boolean(duration?.endsWith('r'));
}

export function parseTimeSignature(timeSignature: string): { numerator: number; denominator: number } {
  const [n, d] = timeSignature.split('/').map(Number);
  return {
    numerator: Number.isFinite(n) && n > 0 ? n : 4,
    denominator: Number.isFinite(d) && d > 0 ? d : 4,
  };
}

export function measureCapacityInQuarterUnits(timeSignature: string): number {
  const { numerator, denominator } = parseTimeSignature(timeSignature);
  return numerator * (4 / denominator);
}

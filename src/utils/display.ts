/**
 * UI-only exercise name normalizer.
 * Navigation already supplies instrument + atlas + topic, so exercise names should
 * contain only the actual exercise name—never "(Guitar)", "(Bass)", or redundant
 * genre/instrument prefixes.
 */
export function cleanExerciseHeading(title: string): string {
  let value = title
    .replace(/\s*\((?:Guitar|Bass)\)\s*$/gi, '')
    .replace(/\bSynthetic Bass\b/gi, '')
    .replace(/\b(?:Guitar|Bass)\b/gi, '')
    .replace(/\bTango\b/gi, '')
    .replace(/^\s*(?:Tango)\s*[—–:-]\s*/i, '')
    .replace(/\s*[—–-]\s*Rhythmic Reframe\s*\d+\s*$/i, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^\s*[—–:-]\s*|\s*[—–:-]\s*$/g, '')
    .trim();

  // Generated source data frequently prefixes an exercise with its topic.
  // Keep the right-hand exercise name when that prefix is redundant.
  const parts = value.split(/\s+—\s+/);
  if (parts.length > 1) {
    const first = parts[0].trim().toLowerCase();
    const redundant = [
      'tango','arrastre','bordoneo','marcato','síncopa','yumba','3+3+2',
      'milonga','vals','guitar effects','bass effects','bass lines',
      'synthetic bass','synthetic-to-traditional bass','808','808 sub bass','trap / 808'
    ];
    if (redundant.includes(first)) value = parts.slice(1).join(' — ').trim();
  }
  return value || title.trim();
}

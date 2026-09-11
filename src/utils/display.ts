export function cleanExerciseHeading(title: string): string {
  return title
    .replace(/\bTango\s+Bass\b/gi, 'Tango')
    .replace(/\bBass\s+Guitar\b/gi, '')
    .replace(/\bBass\b/gi, '')
    .replace(/\bGuitar\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([—–-])/g, ' $1')
    .replace(/([—–-])\s+/g, '$1 ')
    .replace(/\s+([,:])/g, '$1')
    .trim();
}

import { ExerciseItem, VariationType } from '../types';

export interface VariationInfo {
  type: VariationType;
  label: string;
  shortLabel: string;
  description: string;
  badgeClass: string;
  dotClass: string;
}

const VARIATION_METADATA: Record<string, Omit<VariationInfo, 'type'>> = {
  microtiming: {
    label: 'Microtiming Study',
    shortLabel: 'Microtiming',
    description: 'Explores timing placement, push, layback, or subdivision feel.',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dotClass: 'bg-cyan-400',
  },
  permutation: {
    label: 'Permutation',
    shortLabel: 'Permutation',
    description: 'Reorders or permutes the source pattern while preserving its core material.',
    badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    dotClass: 'bg-pink-400',
  },
  etude: {
    label: 'Etude',
    shortLabel: 'Etude',
    description: 'Extended technical or musical study built from the exercise vocabulary.',
    badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    dotClass: 'bg-orange-400',
  },
  cadence: {
    label: 'Cadence Study',
    shortLabel: 'Cadence',
    description: 'Explores a phrase ending, turnaround, or cadence vocabulary.',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    dotClass: 'bg-violet-400',
  },
  base: {
    label: 'Base Pattern',
    shortLabel: 'Base Pattern',
    description: 'Primary pattern or source theme.',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  foundational: {
    label: 'Core Pattern',
    shortLabel: 'Foundational',
    description: 'Core reference pattern in the exercise family.',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400',
  },
  'rhythmic-variation': {
    label: 'Rhythmic Variation',
    shortLabel: 'Rhythm Var',
    description: 'Alters syncopation, subdivisions, metric displacement, or rest placement.',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  rhythmic: {
    label: 'Rhythmic Variant',
    shortLabel: 'Rhythm Var',
    description: 'Alters rhythmic subdivisions, accents, or anticipation.',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400',
  },
  'harmonic-variation': {
    label: 'Harmonic Variation',
    shortLabel: 'Harmony Var',
    description: 'Shifts pitch centers, extensions, chord quality, or harmonic substitutions.',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    dotClass: 'bg-sky-400',
  },
  harmonic: {
    label: 'Harmonic Variant',
    shortLabel: 'Harmony Var',
    description: 'Applies harmonic alteration or chordal reharmonization.',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    dotClass: 'bg-sky-400',
  },
  'melodic-variation': {
    label: 'Melodic Variation',
    shortLabel: 'Melody Var',
    description: 'Modifies intervallic direction, contour, chromatic approaches, or enclosures.',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotClass: 'bg-purple-400',
  },
  melodic: {
    label: 'Melodic Variant',
    shortLabel: 'Melody Var',
    description: 'Explores linear melodic rephrasing and pitch contour.',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotClass: 'bg-purple-400',
  },
  'register-variation': {
    label: 'Register Shift',
    shortLabel: 'Register Var',
    description: 'Transposes the study across octaves or explores upper/lower register tessituras.',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    dotClass: 'bg-indigo-400',
  },
  register: {
    label: 'Register Variant',
    shortLabel: 'Register Var',
    description: 'Transposed octave placement across the instrument.',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    dotClass: 'bg-indigo-400',
  },
  'positional-variation': {
    label: 'Positional Shift',
    shortLabel: 'Position Var',
    description: 'Re-fingers the identical pitches or passage into a different fretboard anchor position.',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dotClass: 'bg-cyan-400',
  },
  position: {
    label: 'Positional Variant',
    shortLabel: 'Position Var',
    description: 'Alternative fretboard position and string selection.',
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dotClass: 'bg-cyan-400',
  },
  'articulation-variation': {
    label: 'Articulation Variant',
    shortLabel: 'Articulation',
    description: 'Alters slurs, hammer-ons, pull-offs, slides, staccato, or ghost notes.',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-400',
  },
  articulation: {
    label: 'Articulation Variant',
    shortLabel: 'Articulation',
    description: 'Alters note attack, damping, or legato phrasing.',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-400',
  },
  'technique-variant': {
    label: 'Technique Variant',
    shortLabel: 'Technique',
    description: 'Transfers passage between picking mechanisms (slap, fingerstyle, pick, thumb).',
    badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    dotClass: 'bg-orange-400',
  },
  technique: {
    label: 'Technique Variant',
    shortLabel: 'Technique',
    description: 'Alternative right/left hand physical execution mechanism.',
    badgeClass: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    dotClass: 'bg-orange-400',
  },
  'instrument-variation': {
    label: 'Instrument Adaptation',
    shortLabel: 'Instrument Var',
    description: 'Adapted specifically to complement guitar or bass string register and physics.',
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    dotClass: 'bg-teal-400',
  },
  application: {
    label: 'Applied Idiom',
    shortLabel: 'Application',
    description: 'Direct musical application inside an authentic repertoire context or song form.',
    badgeClass: 'bg-lime-500/15 text-lime-300 border-lime-500/30',
    dotClass: 'bg-lime-400',
  },
  'advanced-application': {
    label: 'Advanced Variation',
    shortLabel: 'Advanced Var',
    description: 'Combined pattern bringing multiple musical dimensions together.',
    badgeClass: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30',
    dotClass: 'bg-fuchsia-400',
  },
  contrast: {
    label: 'Contrasting Pattern',
    shortLabel: 'Contrast',
    description: 'Presents the inverse musical role or contrapuntal counter-statement.',
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    dotClass: 'bg-violet-400',
  },
  combination: {
    label: 'Composite Pattern',
    shortLabel: 'Composite',
    description: 'Combines musical ideas from multiple patterns into one cohesive exercise.',
    badgeClass: 'bg-amber-600/15 text-amber-200 border-amber-600/30',
    dotClass: 'bg-amber-300',
  },
};

export function getVariationInfo(variationType?: VariationType | string): VariationInfo {
  const key = (variationType || 'base').toLowerCase();
  const meta =
    VARIATION_METADATA[key] || {
      label: 'Study Variation',
      shortLabel: 'Variation',
      description: 'Systematic variation of the foundational study.',
      badgeClass: 'bg-stone-800 text-stone-300 border-stone-700',
      dotClass: 'bg-stone-400',
    };

  return {
    type: (variationType || 'base') as VariationType,
    ...meta,
  };
}

export interface ExerciseFamilyContext {
  hasFamily: boolean;
  familyId?: string;
  familyName: string;
  baseExercise: ExerciseItem;
  currentVariation: VariationInfo;
  familyMembers: ExerciseItem[];
  currentIndex: number;
  totalMembers: number;
}

/**
 * Resolves the family context and sibling variations for a given exercise.
 */
export function getExerciseFamilyContext(
  exercise: ExerciseItem,
  allExercises: ExerciseItem[]
): ExerciseFamilyContext {
  const currentVar = getVariationInfo(exercise.variationType);

  // Filter to current instrument only
  const instrumentExercises = allExercises.filter(
    (e) => e.instrument === exercise.instrument
  );

  let familyMembers: ExerciseItem[] = [];

  if (exercise.familyId) {
    familyMembers = instrumentExercises.filter(
      (e) => e.familyId === exercise.familyId
    );
  } else if (exercise.parentExerciseId) {
    familyMembers = instrumentExercises.filter(
      (e) =>
        e.id === exercise.parentExerciseId ||
        e.parentExerciseId === exercise.parentExerciseId ||
        e.id === exercise.id
    );
  } else {
    // Check if other exercises cite this exercise as their parent
    const children = instrumentExercises.filter(
      (e) => e.parentExerciseId === exercise.id
    );
    if (children.length > 0) {
      familyMembers = [exercise, ...children];
    }
  }

  // Deduplicate
  const seenIds = new Set<string>();
  familyMembers = familyMembers.filter((m) => {
    if (seenIds.has(m.id)) return false;
    seenIds.add(m.id);
    return true;
  });

  if (familyMembers.length <= 1) {
    return {
      hasFamily: false,
      familyId: exercise.familyId,
      familyName: exercise.title,
      baseExercise: exercise,
      currentVariation: currentVar,
      familyMembers: [exercise],
      currentIndex: 0,
      totalMembers: 1,
    };
  }

  // Sort with base exercise first, then by variation types
  familyMembers.sort((a, b) => {
    if (a.variationType === 'base' && b.variationType !== 'base') return -1;
    if (b.variationType === 'base' && a.variationType !== 'base') return 1;
    return a.title.localeCompare(b.title);
  });

  const baseExercise =
    familyMembers.find((m) => m.variationType === 'base') || familyMembers[0];
  const currentIndex = familyMembers.findIndex((m) => m.id === exercise.id);

  const cleanFamilyName = exercise.familyId
    ? exercise.familyId
        .replace(/^family-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()) + ' Study Family'
    : `${baseExercise.title} & Variations`;

  return {
    hasFamily: true,
    familyId: exercise.familyId,
    familyName: cleanFamilyName,
    baseExercise,
    currentVariation: currentVar,
    familyMembers,
    currentIndex: Math.max(0, currentIndex),
    totalMembers: familyMembers.length,
  };
}

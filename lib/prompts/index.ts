import { professionalPrompts } from './professional';
import { lifestylePrompts } from './lifestyle';
import { travelPrompts } from './travel';
import { fitnessPrompts } from './fitness';
import { fashionModelingPrompts } from './fashion-modeling';
import { creativeFantasyPrompts } from './creative-fantasy';
import { cinematicPrompts } from './cinematic';
import { retroPrompts } from './retro';
import { trendyViralPrompts } from './trendy-viral';
import { minimalStudioPrompts } from './minimal-studio';

export type PromptCategory =
  | 'Professional'
  | 'Lifestyle'
  | 'Travel'
  | 'Fitness'
  | 'Fashion / Modeling'
  | 'Creative / Fantasy'
  | 'Cinematic'
  | 'Retro'
  | 'Trendy / Viral'
  | 'Minimal Studio';

export type PromptPreset = {
  id: string;
  label: string;
  prompt: string;
};

export const PROMPT_LIBRARY: Record<PromptCategory, PromptPreset[]> = {
  Professional: professionalPrompts,
  Lifestyle: lifestylePrompts,
  Travel: travelPrompts,
  Fitness: fitnessPrompts,
  'Fashion / Modeling': fashionModelingPrompts,
  'Creative / Fantasy': creativeFantasyPrompts,
  Cinematic: cinematicPrompts,
  Retro: retroPrompts,
  'Trendy / Viral': trendyViralPrompts,
  'Minimal Studio': minimalStudioPrompts,
};

export const ALL_CATEGORIES = Object.keys(PROMPT_LIBRARY) as PromptCategory[];

export function getPromptsByCategory(cat: PromptCategory): PromptPreset[] {
  return PROMPT_LIBRARY[cat] ?? [];
}

export function getRandomPrompt(): {
  category: PromptCategory;
  preset: PromptPreset;
} {
  const cats = ALL_CATEGORIES;
  const cat = cats[Math.floor(Math.random() * cats.length)];
  const list = PROMPT_LIBRARY[cat];
  const preset = list[Math.floor(Math.random() * list.length)];

  return { category: cat, preset };
}

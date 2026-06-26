# Design Memory

## Brand Tone
- **Adjectives:** clean, professional, accessible, efficient
- **Avoid:** cluttered layouts, too many stacked cards, outdated look

## Layout & Spacing
- **Density:** comfortable
- **Grid:** single column, max-w-4xl for content pages
- **Corner radius:** rounded-[32px] for cards, rounded-2xl for inputs, rounded-xl for buttons
- **Shadows:** shadow-sm for cards, shadow-lg/shadow-primary for active states

## Typography
- **Headings:** Inter, extrabold/black (800-900), tracking-tight
- **Body:** Inter, medium (500), text-sm
- **Labels:** text-[10px] font-black uppercase tracking-[0.2em], text-on-surface-variant/40
- **Buttons:** text-[10px] font-black uppercase tracking-widest

## Color
- **Primary:** #3D8B6E (sage green)
- **Primary Dark:** #2E7A58
- **Surface:** #FFFFFF
- **Background:** #F0F7F3
- **On Surface:** #1A3020
- **On Surface Variant:** #3D6048
- **Outline:** #6B9078
- **Outline Variant:** #B5D0BC
- **Error:** #ba1a1a
- **Accent/Amber:** #F59E0B

## Interaction Patterns
- **Edit modes:** Toggle between view/edit with visual border change (border-primary/20 when editing)
- **Status indicators:** Colored dots (green=completed, amber=pending)
- **Save flow:** Explicit save button, disabled when no changes
- **Collapsible sections:** Chevron icon for expandable content

## Accessibility Rules
- **Focus:** visible `focus:ring-4 focus:ring-primary/10` with offset
- **Labels:** always paired with inputs via `htmlFor` or wrapping
- **Motion:** respects prefers-reduced-motion via Tailwind

## Repo Conventions
- **Component structure:** flat files in `components/` dir, one per component
- **Styling approach:** Tailwind utility classes, `cn()` helper from `@/lib/utils`
- **State management:** Zustand store via `useDataStore()`
- **Types:** defined in `src/types/index.ts`, must match `database_relations.md`
- **Data:** currently in-memory (Zustand), will migrate to DB later

---

*Updated by Design Lab — TareaDetailPage refactor*

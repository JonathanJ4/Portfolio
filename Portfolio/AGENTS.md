# AGENTS.md

## Project

This repository contains Jonathan's personal portfolio website.

The portfolio should feel like a minimal personal corner of the internet rather than a generic developer template. It combines three ideas:

1. Professional software engineering portfolio
2. Personal/digital notebook
3. Small, carefully chosen interactive details

Before making design, architecture, or structural decisions, read:

- `docs/PortfolioPlanning_v5.md`

Treat that file as the current source of truth for the portfolio direction.

---

## Current Stack

Use:

- Astro
- TypeScript
- Plain CSS
- Static-first architecture

Planned later where appropriate:

- Markdown / MDX for projects and notes
- HTML Canvas + TypeScript for the pull-cord interaction
- GitHub Pages for deployment
- GitHub Actions for deployment automation

Do not add a backend or database unless the requirements explicitly change.

---

## Dependency Rules

Keep the project lightweight.

Do not add dependencies unless they provide a clear benefit that cannot reasonably be achieved with the existing stack.

Do not introduce any of the following unless explicitly approved:

- React
- Tailwind CSS
- component libraries
- animation libraries
- physics engines
- Three.js
- state-management libraries

Prefer browser APIs, Astro, TypeScript, and CSS when they are sufficient.

If a new dependency seems useful, explain why before adding it.

---

## Design Rules

Follow the approved design direction in `docs/PortfolioPlanning_v5.md`.

Important current principles:

- Minimal layout
- Large intentional whitespace
- No large boxes around the main content
- Navigation and main content should align horizontally at the top
- `JTV` is the current preferred identity/mark
- Avoid generic portfolio-template styling
- Avoid unnecessary cards, pills, shadows, gradients, and decorative UI
- Typography and spacing should carry most of the design
- Animation should be subtle and functional
- The site must remain usable without interacting with animations

Do not redesign approved UI or change the visual direction unless asked.

---

## Architecture Rules

Prefer simple, maintainable structures.

Use semantic HTML where possible.

Create reusable Astro components when something is genuinely reused, but do not create abstractions prematurely.

Keep responsibilities separated.

Examples:

- Theme logic should be independent from the pull-cord physics.
- Rope physics should only signal that a theme toggle occurred.
- CSS should control visual theme values through custom properties.
- Project content should eventually be separate from project presentation.

Avoid large files that combine unrelated responsibilities.

---

## CSS

Use plain CSS.

Prefer:

- CSS custom properties for design tokens and themes
- CSS Grid for the primary desktop layout where appropriate
- Flexbox for smaller one-dimensional layouts
- responsive CSS rather than JavaScript-driven layout
- consistent spacing and typography variables

Avoid:

- arbitrary one-off values everywhere
- excessive absolute positioning for primary layout
- `!important` unless there is a strong reason
- unnecessary animation
- styling directly in page markup when a reusable stylesheet is more appropriate

---

## TypeScript

Use TypeScript for interactive browser code.

Keep types simple and explicit.

For physics or interaction code, prefer small focused types and functions rather than one large class or script.

Do not use `any` unless there is a justified reason.

---

## Accessibility

Interactive features must remain accessible.

For controls:

- support keyboard use
- provide visible focus states
- use semantic elements when possible
- do not make Canvas the only way to perform an important action
- support touch/pointer input where appropriate
- respect `prefers-reduced-motion`

The pull-cord theme switch must have an accessible fallback.

---

## Responsive Design

Desktop is important, but mobile must be intentionally designed.

Do not rely exclusively on hover interactions.

Ensure:

- navigation remains usable
- text remains readable
- content does not overflow
- interactive targets are large enough for touch
- decorative interactions can simplify or disappear if they hurt usability

---

## Workflow

For non-trivial work:

1. Read the relevant planning documentation.
2. Inspect the existing implementation before changing it.
3. State or form a short implementation plan.
4. Make the smallest coherent change.
5. Verify the result.
6. Run the project build.
7. Summarize what changed and any remaining concerns.

Do not implement unrelated improvements while completing a focused task.

---

## Validation

After meaningful code changes, run:

```bash
npm run build
```

Resolve build errors before considering the task complete.

When relevant, also verify:

- route navigation
- desktop layout
- mobile layout
- light and dark themes
- keyboard interaction
- direct loading of individual routes

---

## Git

Keep commits focused.

Do not commit generated or dependency directories such as:

- `node_modules/`
- `dist/`
- `.astro/`

Do not modify `.gitignore` to include generated files unless explicitly requested.

---

## Current Development Order

Unless the plan changes, build the portfolio in roughly this order:

1. Project foundation
2. Basic page and route structure
3. Shared layout
4. Desktop grid
5. Design tokens and typography
6. Basic light/dark theme using a normal control
7. Real project/content structure
8. Responsive layout
9. Top/bottom viewport fade
10. Pull-cord physics prototype
11. Pull-cord theme integration
12. Accessibility pass
13. Page transitions and micro-interactions
14. Performance/quality pass
15. GitHub Pages deployment

Do not jump ahead to complex interactions before the underlying site works.

---

## Current Priority

The current priority is to build a simple, correct base before adding polish.

A feature should first work in the simplest form possible. Then improve its presentation and interaction.

For example:

```text
working theme button
        ↓
stable theme system
        ↓
pull-cord interaction
        ↓
pull-cord calls existing theme system
```

Use this dependency-first approach throughout the project.

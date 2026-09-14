# AGENTS.md

Guidance for AI agents (AI Studio agent, Claude Code, or any other coding
assistant) working in this repository. Read this before making changes.

## Project overview

A German-learning web app built with React + Vite + TypeScript, using the
Gemini API for AI-generated content/feedback. Originally scaffolded from
Google AI Studio's `aistudio-repository-template`.

**Stack:**
- Frontend: React 19, Vite 6, TypeScript, Tailwind CSS v4
- Backend: Express (`server.ts`, bundled to `dist/server.cjs` via esbuild)
- AI: `@google/genai` (Gemini API)
- Animation: `motion`

## Commands

- `npm run dev` — start the dev server (tsx server.ts)
- `npm run build` — build client (vite build) + bundle server (esbuild)
- `npm start` — run the production server from `dist/`
- `npm run preview` — preview the built client
- `npm run lint` — type-check only (`tsc --noEmit`) — there is currently no
  ESLint config; if you add one, wire it into this script
- `npm run clean` — remove build output

There is currently no test script. If you add tests (recommended: Vitest),
add a `"test"` script to `package.json` and use it before considering any
change done.

## Environment variables

Defined in `.env.example`, copy to `.env` for local dev:
- `GEMINI_API_KEY` — required for Gemini API calls. In AI Studio this is
  injected automatically; locally you must set it yourself.
- `APP_URL` — used for self-referential links/callbacks. AI Studio injects
  this with the Cloud Run URL at runtime.

Never commit a populated `.env` file. Never print or log the value of
`GEMINI_API_KEY`.

## Repo conventions

- **No loose patch scripts.** Do not add standalone scripts like
  `patch_*.cjs`, `patch_*.js`, or `*_patch.cjs` at the repo root to work
  around bugs. This repo previously accumulated several of these
  (`patch.cjs`, `patch_fix.cjs`, `patch_fix2.cjs`, `patch_path.cjs`,
  `patch_progress.js`, `patch_quiz.cjs`, `patch_quiz_finish.cjs`,
  `builder_patch.cjs`) — all fixes should instead be made directly in the
  relevant file(s) under `src/` and committed normally. If you find a bug,
  fix it at the source, don't patch around it.
- **Keep changes scoped.** Prefer small, verifiable changes over broad
  rewrites. After each change, confirm the app still builds
  (`npm run build`) and runs (`npm run dev`) before moving on.
- **Reuse existing state/components** rather than introducing new state
  management libraries or UI frameworks unless there's a clear need.
- **TypeScript strictness**: don't add `any` or `@ts-ignore` to silence
  errors — fix the underlying type issue, or ask for guidance if the fix
  isn't obvious.

## Before committing / finishing a task

1. `npm run build` succeeds with no errors.
2. `npm run lint` (`tsc --noEmit`) passes.
3. If tests exist, they pass.
4. No secrets (API keys, tokens) are present in any file being committed.
5. No new root-level patch/workaround scripts have been added.
6. If you changed user-facing behavior, note it briefly in the PR/commit
   description — this repo has minimal history, so clear commit messages
   matter more than usual here.

## What NOT to do

- Don't commit directly patched `dist/` output.
- Don't disable `hmr`/`watch` settings in `vite.config.ts` outside of the
  `DISABLE_HMR` env var mechanism already in place (this exists specifically
  for agent-driven edits in AI Studio — don't work around it).
- Don't remove `.gitignore` entries for `.env` or `node_modules`.

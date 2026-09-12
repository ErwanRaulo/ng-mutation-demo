# @ngsignal/mutation — demo app

Angular 21 app that teaches `@ngsignal/mutation` through small interactive examples.
Educational first: the library API must stay visible, never hidden behind architecture.

## Where things are

- Library, released code: `../ngx-mutation` (`main`, latest tag = v0.4.0)
  - source `src/mutation.ts`, `src/mutation.types.ts` · tests `src/mutation.spec.ts`
  - docs `README.md`, `docs/RECIPES.md`, `docs/ARCHITECTURE.md`, `CHANGELOG.md`
- Library, unreleased features: `../ngx-mutation-http` (worktree on `feat/http-mutation`:
  `rxMutation`, `httpMutation`)
- Version actually running: `vendor/ngsignal-mutation-0.4.0.tgz`, packed from
  `feat/http-mutation`, so it contains released AND unreleased APIs.
  The `.d.ts` files in `node_modules/@ngsignal/mutation/dist` are the ground truth.
- One demo = `src/app/demos/<name>-page/` (`.ts` + `.html`), registered in
  `src/app/app.routes.ts` and in the sidebar in `src/app/app.html`.
- Fake backends: `src/app/shared/fake-api.ts` (delayed promises),
  `src/app/shared/fake-http-backend.ts` (`HttpInterceptorFn`).

## Commands

- `npm start` — dev server on http://localhost:4200
- `npm run build` — must pass before a task is done
- Update the library: in the worktree containing the features to demo, `npm pack`,
  copy the tgz to `vendor/`, update `package.json`, `npm install`, then update the
  version and the nav groups in `app.html`.
- No test runner is configured yet.

## Rules

1. **The library is the source of truth.** Before demoing a feature, read the README and
   the installed implementation. Never infer behavior from other libraries (TanStack Query…).
2. **Never invent or simulate a library feature.** Label app-level patterns as such.
3. **Precise terminology.** No "cancellation" if the call keeps running; no
   "concurrency control" unless the code actually does that.
4. **Use the mutation's state, don't duplicate it** (no extra `isLoading` signal).
5. **Displayed code = executed code.**
6. **Deterministic demos**: local mocks, errors triggered by a button, artificial delays labeled.
7. If README and implementation disagree: report it, don't pick an interpretation.
   The demo is never the source of truth for library behavior.

## Navigation

Sidebar in `src/app/app.html`, two groups:

- "Released (vX.Y.Z)": APIs present in the latest library tag
- "What's next ?": APIs only in the vendored tgz (not tagged yet)

## Read when relevant

- `agent_docs/adding-a-demo.md` — page layout, code-example rules, checklist
- `agent_docs/ui-guidelines.md` — UX, accessibility, responsive rules

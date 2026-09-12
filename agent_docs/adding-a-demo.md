# Adding or changing a demo

## Checklist

1. Confirm the API exists in `node_modules/@ngsignal/mutation/dist/*.d.ts`.
2. Confirm how it behaves: README, then source, then tests when ambiguous
   (released: `../ngx-mutation`, unreleased: `../ngx-mutation-http`).
3. Create `src/app/demos/<name>-page/<name>-page.ts` + `.html` (standalone component).
4. Add the route in `src/app/app.routes.ts` and the link in the right nav group of
   `src/app/app.html` ("Released" vs "What's next ?").
5. Add a line to `README.md` if the page shows something new.
6. `npm run build`.

## What a demo should answer

Depending on the feature: what problem it solves, how to create / execute a mutation,
what state it exposes, how success, errors, the returned value and reset work, and
the relevant edge cases.

## Page layout

```text
Title
Short explanation

┌──────────────────────────────────────┐
│ Interactive example                  │
│ [ Action ]                           │
│ Current state                        │
│ Result / Error                       │
└──────────────────────────────────────┘

How it works

Relevant code
```

Keep it consistent across pages, but don't force it when it makes the concept harder
to understand.

## Keeping the API visible

The reader must immediately spot where the mutation is created, where its mutation
function is defined, where it is executed and where its state is consumed:

```text
User action → mutation.mutate(...) → mutationFn(...) → mutation state → UI
```

- No services, factories or wrappers that hide the API. Duplicating a few lines is fine.
- Show all observable state in the UI, not only in the console (including errors).
- Code snippets: short, strongly typed, idiomatic Angular (signals, `inject()`,
  `@if`/`@for`), copy-pastable, and matching the code that actually runs.
- Link to the library README instead of repeating it.

## Tests (once a runner exists)

Test what the demo claims: initial state, success, error, pending, reset, and any
subtle semantics (concurrency, stale results), so the demo breaks loudly when the
library changes.

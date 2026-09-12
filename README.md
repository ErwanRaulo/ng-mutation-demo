# @ngsignal/mutation demo

A small Angular app showcasing `mutation()` primitive.

It has three routes showing the same "user list" feature:

- **`/`**  [`WithMutationPage`](src/app/with-mutation-page/with-mutation-page.ts) implements `createUser`/`deleteUser` with `mutation()`: pending/error state, stale-response handling, and cancellation all come for free.
- **`/manual`**  [`WithoutMutationPage`](src/app/without-mutation-page/without-mutation-page.ts) implements the exact same feature by hand, to show what `mutation()` replaces.
- **`/detailed`**  [`DetailedPage`](src/app/detailed-page/detailed-page.ts) is the `mutation()` version again, but with the full state panel and a step-by-step activity log for every call, so you can watch the abort/race-condition handling happen in real time.

The "API" calls in [`fake-api.ts`](src/app/fake-api.ts) are simulated with a delay so you can see pending/loading states and try racing requests.

## Running it

```bash
npm install
npm start
```

Then open `http://localhost:4200`.

## Building

```bash
npm run build
```
